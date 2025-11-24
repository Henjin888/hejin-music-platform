import pytest
from datetime import datetime
from src.app import create_app
from src.models.models import db, User, Music, Report, Blacklist, UserRole, AuditStatus

@pytest.fixture
def app():
    """创建测试应用"""
    config = {
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'JWT_SECRET_KEY': 'test-secret-key'
    }
    app = create_app(config)
    
    with app.app_context():
        db.create_all()
        
        # 创建测试用户
        admin_user = User(
            username='admin',
            email='admin@test.com',
            password_hash='hashed_password',
            role=UserRole.ADMIN
        )
        
        normal_user = User(
            username='user1',
            email='user1@test.com',
            password_hash='hashed_password',
            role=UserRole.NORMAL
        )
        
        creator_user = User(
            username='creator1',
            email='creator1@test.com',
            password_hash='hashed_password',
            role=UserRole.CREATOR
        )
        
        db.session.add_all([admin_user, normal_user, creator_user])
        
        # 创建测试音乐
        test_music = Music(
            title='Test Music',
            description='Test Description',
            file_url='http://example.com/music.mp3',
            creator_id=3,  # creator_user
            audit_status=AuditStatus.PENDING
        )
        
        db.session.add(test_music)
        db.session.commit()
    
    return app

@pytest.fixture
def client(app):
    """创建测试客户端"""
    return app.test_client()

@pytest.fixture
def auth_headers(app):
    """创建认证头"""
    from flask_jwt_extended import create_access_token
    
    with app.app_context():
        # 创建管理员token
        admin_token = create_access_token(identity=1)
        user_token = create_access_token(identity=2)
        
        return {
            'admin': {'Authorization': f'Bearer {admin_token}'},
            'user': {'Authorization': f'Bearer {user_token}'}
        }