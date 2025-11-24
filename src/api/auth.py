from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError, validates, validates_schema
from ..models.models import db, User, UserRole
import re

# 创建蓝图
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# 请求验证模式
class RegisterSchema(Schema):
    username = fields.String(required=True)
    email = fields.Email(required=True)
    password = fields.String(required=True)
    
    @validates_schema
    def validate_all(self, data, **kwargs):
        """验证所有字段"""
        # 验证用户名
        if 'username' in data:
            username = data['username'].strip()
            if len(username) < 3:
                raise ValidationError('用户名至少3个字符', 'username')
            if len(username) > 80:
                raise ValidationError('用户名最多80个字符', 'username')
            if not re.match(r'^[a-zA-Z0-9_]+$', username):
                raise ValidationError('用户名只能包含字母、数字和下划线', 'username')
        
        # 验证密码
        if 'password' in data:
            if len(data['password']) < 6:
                raise ValidationError('密码至少6个字符', 'password')

class LoginSchema(Schema):
    username = fields.String(required=True, validate=lambda x: len(x.strip()) > 0)
    password = fields.String(required=True, validate=lambda x: len(x) > 0)

@auth_bp.route('/register', methods=['POST'])
def register():
    """用户注册"""
    try:
        schema = RegisterSchema()
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"success": False, "message": "请求参数错误", "errors": err.messages}), 400
    
    username = data['username'].strip()
    email = data['email'].strip().lower()
    password = data['password']
    
    # 检查用户名是否已存在
    if User.query.filter_by(username=username).first():
        return jsonify({"success": False, "message": "用户名已存在"}), 400
    
    # 检查邮箱是否已存在
    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "邮箱已被注册"}), 400
    
    # 创建新用户
    try:
        new_user = User(
            username=username,
            email=email,
            role=UserRole.NORMAL
        )
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "注册成功",
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": f"注册失败: {str(e)}"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """用户登录"""
    try:
        schema = LoginSchema()
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"success": False, "message": "请求参数错误", "errors": err.messages}), 400
    
    username = data['username'].strip()
    password = data['password']
    
    # 查找用户
    user = User.query.filter_by(username=username).first()
    
    # 验证用户名和密码
    if not user or not user.check_password(password):
        return jsonify({"success": False, "message": "用户名或密码错误"}), 401
    
    # 生成JWT令牌
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        "success": True,
        "message": "登录成功",
        "access_token": access_token,
        "user_id": user.id,
        "username": user.username
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """获取当前用户信息"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"success": False, "message": "用户不存在"}), 404
    
    return jsonify({
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role.value,
            "avatar_url": user.avatar_url,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    }), 200

# 错误处理
@auth_bp.errorhandler(404)
def not_found_error(error):
    return jsonify({"success": False, "message": "API端点未找到"}), 404

@auth_bp.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "message": "服务器内部错误"}), 500
