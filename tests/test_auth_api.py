import pytest
from flask_jwt_extended import create_access_token
from src.models.models import db, User, UserRole


class TestAuthAPI:
    """认证API测试"""
    
    def test_register_success(self, client, app):
        """测试成功注册"""
        data = {
            "username": "newuser",
            "email": "newuser@test.com",
            "password": "password123"
        }
        
        response = client.post('/api/auth/register', json=data)
        assert response.status_code == 201
        json_data = response.get_json()
        assert json_data['success'] is True
        assert json_data['message'] == "注册成功"
        assert json_data['user']['username'] == "newuser"
        assert json_data['user']['email'] == "newuser@test.com"
        assert 'id' in json_data['user']
        
        # 验证用户已创建
        with app.app_context():
            user = User.query.filter_by(username="newuser").first()
            assert user is not None
            assert user.email == "newuser@test.com"
            assert user.check_password("password123")
    
    def test_register_duplicate_username(self, client, app):
        """测试重复用户名注册"""
        data = {
            "username": "admin",  # 已存在的用户名
            "email": "newemail@test.com",
            "password": "password123"
        }
        
        response = client.post('/api/auth/register', json=data)
        assert response.status_code == 400
        json_data = response.get_json()
        assert json_data['success'] is False
        assert "用户名已存在" in json_data['message']
    
    def test_register_duplicate_email(self, client, app):
        """测试重复邮箱注册"""
        data = {
            "username": "newuser2",
            "email": "admin@test.com",  # 已存在的邮箱
            "password": "password123"
        }
        
        response = client.post('/api/auth/register', json=data)
        assert response.status_code == 400
        json_data = response.get_json()
        assert json_data['success'] is False
        assert "邮箱已被注册" in json_data['message']
    
    def test_register_invalid_username(self, client, app):
        """测试无效用户名"""
        # 用户名包含特殊字符
        data = {
            "username": "user@name",
            "email": "test@test.com",
            "password": "password123"
        }
        
        response = client.post('/api/auth/register', json=data)
        assert response.status_code == 400
        json_data = response.get_json()
        assert json_data['success'] is False
        
        # 用户名太短
        data = {
            "username": "ab",
            "email": "test2@test.com",
            "password": "password123"
        }
        
        response = client.post('/api/auth/register', json=data)
        assert response.status_code == 400
        json_data = response.get_json()
        assert json_data['success'] is False
    
    def test_register_invalid_email(self, client, app):
        """测试无效邮箱"""
        data = {
            "username": "newuser3",
            "email": "invalid-email",
            "password": "password123"
        }
        
        response = client.post('/api/auth/register', json=data)
        assert response.status_code == 400
        json_data = response.get_json()
        assert json_data['success'] is False
    
    def test_register_short_password(self, client, app):
        """测试密码过短"""
        data = {
            "username": "newuser4",
            "email": "test4@test.com",
            "password": "12345"  # 少于6个字符
        }
        
        response = client.post('/api/auth/register', json=data)
        assert response.status_code == 400
        json_data = response.get_json()
        assert json_data['success'] is False
    
    def test_register_missing_fields(self, client, app):
        """测试缺少必填字段"""
        # 缺少username
        data = {
            "email": "test5@test.com",
            "password": "password123"
        }
        
        response = client.post('/api/auth/register', json=data)
        assert response.status_code == 400
        
        # 缺少email
        data = {
            "username": "newuser5",
            "password": "password123"
        }
        
        response = client.post('/api/auth/register', json=data)
        assert response.status_code == 400
        
        # 缺少password
        data = {
            "username": "newuser6",
            "email": "test6@test.com"
        }
        
        response = client.post('/api/auth/register', json=data)
        assert response.status_code == 400
    
    def test_login_success(self, client, app):
        """测试成功登录"""
        # 首先注册一个用户
        with app.app_context():
            user = User(username="testlogin", email="testlogin@test.com", role=UserRole.NORMAL)
            user.set_password("password123")
            db.session.add(user)
            db.session.commit()
        
        # 尝试登录
        data = {
            "username": "testlogin",
            "password": "password123"
        }
        
        response = client.post('/api/auth/login', json=data)
        assert response.status_code == 200
        json_data = response.get_json()
        assert json_data['success'] is True
        assert json_data['message'] == "登录成功"
        assert 'access_token' in json_data
        assert 'user_id' in json_data
        assert json_data['username'] == "testlogin"
    
    def test_login_wrong_password(self, client, app):
        """测试错误密码登录"""
        data = {
            "username": "admin",
            "password": "wrongpassword"
        }
        
        response = client.post('/api/auth/login', json=data)
        assert response.status_code == 401
        json_data = response.get_json()
        assert json_data['success'] is False
        assert "用户名或密码错误" in json_data['message']
    
    def test_login_nonexistent_user(self, client, app):
        """测试不存在的用户登录"""
        data = {
            "username": "nonexistentuser",
            "password": "password123"
        }
        
        response = client.post('/api/auth/login', json=data)
        assert response.status_code == 401
        json_data = response.get_json()
        assert json_data['success'] is False
        assert "用户名或密码错误" in json_data['message']
    
    def test_login_missing_fields(self, client, app):
        """测试登录缺少字段"""
        # 缺少username
        data = {
            "password": "password123"
        }
        
        response = client.post('/api/auth/login', json=data)
        assert response.status_code == 400
        
        # 缺少password
        data = {
            "username": "admin"
        }
        
        response = client.post('/api/auth/login', json=data)
        assert response.status_code == 400
    
    def test_get_current_user_success(self, client, app, auth_headers):
        """测试获取当前用户信息"""
        response = client.get('/api/auth/me', headers=auth_headers['admin'])
        assert response.status_code == 200
        json_data = response.get_json()
        assert json_data['success'] is True
        assert 'user' in json_data
        assert json_data['user']['username'] == 'admin'
        assert json_data['user']['email'] == 'admin@test.com'
        assert json_data['user']['role'] == '管理员'
    
    def test_get_current_user_no_token(self, client, app):
        """测试没有令牌时获取当前用户信息"""
        response = client.get('/api/auth/me')
        assert response.status_code == 401
        json_data = response.get_json()
        assert json_data['success'] is False
    
    def test_get_current_user_invalid_token(self, client, app):
        """测试无效令牌"""
        headers = {'Authorization': 'Bearer invalid_token_here'}
        response = client.get('/api/auth/me', headers=headers)
        assert response.status_code == 401
    
    def test_password_encryption(self, app):
        """测试密码加密存储"""
        with app.app_context():
            user = User(username="testenc", email="testenc@test.com", role=UserRole.NORMAL)
            user.set_password("mypassword")
            
            # 密码应该被加密，不应该以明文存储
            assert user.password_hash != "mypassword"
            assert len(user.password_hash) > 20  # 加密后的密码应该较长
            
            # 验证密码应该成功
            assert user.check_password("mypassword") is True
            assert user.check_password("wrongpassword") is False
    
    def test_register_user_gets_normal_role(self, client, app):
        """测试注册的用户默认获得普通角色"""
        data = {
            "username": "normaluser",
            "email": "normaluser@test.com",
            "password": "password123"
        }
        
        response = client.post('/api/auth/register', json=data)
        assert response.status_code == 201
        
        with app.app_context():
            user = User.query.filter_by(username="normaluser").first()
            assert user.role == UserRole.NORMAL
    
    def test_login_returns_valid_jwt(self, client, app):
        """测试登录返回有效的JWT"""
        # 注册用户
        with app.app_context():
            user = User(username="jwttest", email="jwttest@test.com", role=UserRole.NORMAL)
            user.set_password("password123")
            db.session.add(user)
            db.session.commit()
            user_id = user.id
        
        # 登录
        data = {
            "username": "jwttest",
            "password": "password123"
        }
        
        response = client.post('/api/auth/login', json=data)
        json_data = response.get_json()
        token = json_data['access_token']
        
        # 使用token访问受保护的端点
        headers = {'Authorization': f'Bearer {token}'}
        response = client.get('/api/auth/me', headers=headers)
        assert response.status_code == 200
        json_data = response.get_json()
        assert json_data['user']['id'] == user_id
