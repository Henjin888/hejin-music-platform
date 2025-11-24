from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from datetime import timedelta

def create_app(config=None):
    """应用工厂函数"""
    app = Flask(__name__)
    
    # 配置
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
        'DATABASE_URL', 'sqlite:///music_platform.db'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    
    # 如果提供了配置，则更新
    if config:
        app.config.update(config)
    
    # 初始化扩展
    from src.models.models import db
    db.init_app(app)
    
    migrate = Migrate(app, db)
    jwt = JWTManager(app)
    CORS(app)
    
    # 注册蓝图
    from src.api.moderation import moderation_bp
    from src.api.auth import auth_bp
    app.register_blueprint(moderation_bp)
    app.register_blueprint(auth_bp)
    
    # 基础健康检查路由
    @app.route('/health')
    def health_check():
        return jsonify({"status": "healthy", "service": "music-platform-moderation"})
    
    @app.route('/admin')
    def admin_dashboard():
        """管理员控制台"""
        return render_template('admin_dashboard.html')
    
    @app.route('/')
    def index():
        return jsonify({
            "service": "Music Platform Content Moderation System",
            "version": "1.0.0",
            "admin_dashboard": "/admin",
            "api_endpoints": [
                "/api/auth/register",
                "/api/auth/login",
                "/api/auth/me",
                "/api/report/create",
                "/api/report/list",
                "/api/blacklist/add",
                "/api/blacklist/list",
                "/api/music/<id>/audit",
                "/api/content-filter/add"
            ]
        })
    
    # JWT错误处理
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"success": False, "message": "Token已过期"}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"success": False, "message": "Token无效"}), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"success": False, "message": "需要访问令牌"}), 401
    
    # 创建数据库表
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)