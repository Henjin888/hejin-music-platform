from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from ..models.models import db, Music, AuditStatus

# 创建蓝图
music_bp = Blueprint('music', __name__, url_prefix='/api/music')

# 请求验证模式
class MusicUploadSchema(Schema):
    title = fields.String(required=True, validate=lambda x: len(x.strip()) > 0)
    description = fields.String(load_default='')
    file_url = fields.String(required=True, validate=lambda x: len(x.strip()) > 0)
    genre = fields.String(load_default='')
    cover_url = fields.String(load_default='')

@music_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_music():
    """上传音乐作品（登录用户）"""
    try:
        schema = MusicUploadSchema()
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"success": False, "message": "请求参数错误", "errors": err.messages}), 400
    
    current_user_id = get_jwt_identity()
    
    # 创建音乐作品
    music = Music(
        title=data['title'],
        description=data['description'],
        file_url=data['file_url'],
        genre=data['genre'],
        cover_url=data['cover_url'],
        creator_id=current_user_id,
        audit_status=AuditStatus.PENDING
    )
    
    db.session.add(music)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": "音乐作品上传成功，等待审核",
        "music_id": music.id,
        "audit_status": music.audit_status.value
    }), 201

@music_bp.route('/list', methods=['GET'])
def list_music():
    """获取公开音乐作品列表"""
    # 分页参数
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    # 筛选参数
    genre = request.args.get('genre')
    audit_status = request.args.get('audit_status')
    
    # 构建查询
    query = Music.query.filter_by(is_public=True)
    
    # 应用筛选
    if genre:
        query = query.filter_by(genre=genre)
    
    if audit_status:
        try:
            status_enum = AuditStatus[audit_status.upper()]
            query = query.filter_by(audit_status=status_enum)
        except KeyError:
            return jsonify({"success": False, "message": "无效的审核状态"}), 400
    
    # 分页
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    # 序列化结果
    music_list = []
    for music in pagination.items:
        music_list.append({
            "id": music.id,
            "title": music.title,
            "file_url": music.file_url,
            "cover_url": music.cover_url,
            "genre": music.genre,
            "creator_id": music.creator_id,
            "audit_status": music.audit_status.value
        })
    
    return jsonify({
        "success": True,
        "data": music_list,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": pagination.total,
            "pages": pagination.pages
        }
    })

@music_bp.route('/<int:music_id>', methods=['GET'])
def get_music_detail(music_id):
    """获取音乐作品详情"""
    music = db.session.get(Music, music_id)
    
    if not music:
        return jsonify({"success": False, "message": "音乐作品不存在"}), 404
    
    # 只返回公开作品的详情
    if not music.is_public:
        return jsonify({"success": False, "message": "音乐作品不可访问"}), 403
    
    return jsonify({
        "success": True,
        "data": {
            "id": music.id,
            "title": music.title,
            "description": music.description,
            "file_url": music.file_url,
            "cover_url": music.cover_url,
            "genre": music.genre,
            "creator_id": music.creator_id,
            "upload_time": music.upload_time.isoformat() if music.upload_time else None,
            "audit_status": music.audit_status.value,
            "price": str(music.price) if music.price else None
        }
    })

# 错误处理
@music_bp.errorhandler(404)
def not_found_error(error):
    return jsonify({"success": False, "message": "API端点未找到"}), 404

@music_bp.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "message": "服务器内部错误"}), 500
