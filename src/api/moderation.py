from flask import Flask, Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, JWTManager
from marshmallow import Schema, fields, ValidationError
from ..services.moderation_service import ContentModerationService
from ..models.models import UserRole, User
from datetime import datetime

# 创建蓝图
moderation_bp = Blueprint('moderation', __name__, url_prefix='/api')

# 请求验证模式
class ReportCreateSchema(Schema):
    music_id = fields.Integer(required=True)
    reason = fields.String(required=True, validate=lambda x: len(x.strip()) > 0)

class ProcessReportSchema(Schema):
    action = fields.String(required=True, validate=lambda x: x in ['approve', 'reject'])
    comment = fields.String(load_default='')

class BlacklistAddSchema(Schema):
    user_id = fields.Integer(required=True)
    reason = fields.String(required=True, validate=lambda x: len(x.strip()) > 0)
    end_date = fields.DateTime(load_default=None)

class MusicAuditSchema(Schema):
    action = fields.String(required=True, validate=lambda x: x in ['approve', 'reject'])
    comment = fields.String(load_default='')

class ContentFilterSchema(Schema):
    keyword = fields.String(required=True, validate=lambda x: len(x.strip()) > 0)
    filter_type = fields.String(required=True, validate=lambda x: x in ['title', 'description', 'both'])
    action = fields.String(required=True, validate=lambda x: x in ['block', 'flag', 'moderate'])

def require_admin_role():
    """装饰器：要求管理员权限"""
    def decorator(f):
        from functools import wraps
        
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if not user or user.role != UserRole.ADMIN:
                return jsonify({"success": False, "message": "需要管理员权限"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@moderation_bp.route('/report/create', methods=['POST'])
@jwt_required()
def create_report():
    """创建举报"""
    try:
        schema = ReportCreateSchema()
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"success": False, "message": "请求参数错误", "errors": err.messages}), 400
    
    current_user_id = get_jwt_identity()
    result = ContentModerationService.submit_report(
        reporter_id=current_user_id,
        music_id=data['music_id'],
        reason=data['reason']
    )
    
    status_code = 200 if result['success'] else 400
    return jsonify(result), status_code

@moderation_bp.route('/report/list', methods=['GET'])
@jwt_required()
@require_admin_role()
def get_reports():
    """获取举报列表（管理员）"""
    status = request.args.get('status')
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    result = ContentModerationService.get_reports(
        status=status,
        page=page,
        per_page=per_page
    )
    
    status_code = 200 if result['success'] else 400
    return jsonify(result), status_code

@moderation_bp.route('/report/<int:report_id>/process', methods=['POST'])
@jwt_required()
@require_admin_role()
def process_report(report_id):
    """处理举报（管理员）"""
    try:
        schema = ProcessReportSchema()
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"success": False, "message": "请求参数错误", "errors": err.messages}), 400
    
    current_user_id = get_jwt_identity()
    result = ContentModerationService.process_report(
        report_id=report_id,
        admin_id=current_user_id,
        action=data['action'],
        comment=data['comment']
    )
    
    status_code = 200 if result['success'] else 400
    return jsonify(result), status_code

@moderation_bp.route('/blacklist/add', methods=['POST'])
@jwt_required()
@require_admin_role()
def add_to_blacklist():
    """添加用户到黑名单（管理员）"""
    try:
        schema = BlacklistAddSchema()
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"success": False, "message": "请求参数错误", "errors": err.messages}), 400
    
    current_user_id = get_jwt_identity()
    result = ContentModerationService.add_to_blacklist(
        user_id=data['user_id'],
        admin_id=current_user_id,
        reason=data['reason'],
        end_date=data['end_date']
    )
    
    status_code = 200 if result['success'] else 400
    return jsonify(result), status_code

@moderation_bp.route('/blacklist/list', methods=['GET'])
@jwt_required()
@require_admin_role()
def get_blacklisted_users():
    """获取黑名单用户列表（管理员）"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    result = ContentModerationService.get_blacklisted_users(
        page=page,
        per_page=per_page
    )
    
    status_code = 200 if result['success'] else 400
    return jsonify(result), status_code

@moderation_bp.route('/music/<int:music_id>/audit', methods=['POST'])
@jwt_required()
@require_admin_role()
def audit_music(music_id):
    """音乐审核（管理员）"""
    try:
        schema = MusicAuditSchema()
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"success": False, "message": "请求参数错误", "errors": err.messages}), 400
    
    current_user_id = get_jwt_identity()
    result = ContentModerationService.audit_music(
        music_id=music_id,
        admin_id=current_user_id,
        action=data['action'],
        comment=data['comment']
    )
    
    status_code = 200 if result['success'] else 400
    return jsonify(result), status_code

@moderation_bp.route('/content-filter/add', methods=['POST'])
@jwt_required()
@require_admin_role()
def add_content_filter():
    """添加内容过滤器（管理员）"""
    try:
        schema = ContentFilterSchema()
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"success": False, "message": "请求参数错误", "errors": err.messages}), 400
    
    current_user_id = get_jwt_identity()
    result = ContentModerationService.add_content_filter(
        keyword=data['keyword'],
        filter_type=data['filter_type'],
        action=data['action'],
        admin_id=current_user_id
    )
    
    status_code = 200 if result['success'] else 400
    return jsonify(result), status_code

@moderation_bp.route('/user/blacklist-status/<int:user_id>', methods=['GET'])
@jwt_required()
@require_admin_role()
def check_user_blacklist_status(user_id):
    """检查用户黑名单状态（管理员）"""
    is_blacklisted = ContentModerationService.is_user_blacklisted(user_id)
    
    return jsonify({
        "success": True,
        "user_id": user_id,
        "is_blacklisted": is_blacklisted
    })

# 错误处理
@moderation_bp.errorhandler(404)
def not_found_error(error):
    return jsonify({"success": False, "message": "API端点未找到"}), 404

@moderation_bp.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "message": "服务器内部错误"}), 500