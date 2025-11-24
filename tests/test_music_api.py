import pytest
import json
from src.models.models import Music, AuditStatus

class TestMusicAPI:
    """音乐API测试"""
    
    def test_upload_music_success(self, client, auth_headers):
        """测试成功上传音乐作品"""
        data = {
            'title': '新音乐作品',
            'description': '这是一个测试音乐作品',
            'file_url': 'http://example.com/music.mp3',
            'genre': '流行',
            'cover_url': 'http://example.com/cover.jpg'
        }
        response = client.post('/api/music/upload',
                             headers=auth_headers['user'],
                             data=json.dumps(data),
                             content_type='application/json')
        
        assert response.status_code == 201
        result = json.loads(response.data)
        assert result['success'] is True
        assert 'music_id' in result
        assert result['audit_status'] == '待审核'
    
    def test_upload_music_missing_title(self, client, auth_headers):
        """测试上传音乐缺少标题"""
        data = {
            'file_url': 'http://example.com/music.mp3'
        }
        response = client.post('/api/music/upload',
                             headers=auth_headers['user'],
                             data=json.dumps(data),
                             content_type='application/json')
        
        assert response.status_code == 400
        result = json.loads(response.data)
        assert result['success'] is False
    
    def test_upload_music_missing_file_url(self, client, auth_headers):
        """测试上传音乐缺少文件URL"""
        data = {
            'title': '新音乐作品'
        }
        response = client.post('/api/music/upload',
                             headers=auth_headers['user'],
                             data=json.dumps(data),
                             content_type='application/json')
        
        assert response.status_code == 400
        result = json.loads(response.data)
        assert result['success'] is False
    
    def test_upload_music_without_auth(self, client):
        """测试未登录上传音乐"""
        data = {
            'title': '新音乐作品',
            'file_url': 'http://example.com/music.mp3'
        }
        response = client.post('/api/music/upload',
                             data=json.dumps(data),
                             content_type='application/json')
        
        assert response.status_code == 401
    
    def test_list_music_empty(self, client):
        """测试获取空音乐列表"""
        response = client.get('/api/music/list')
        
        assert response.status_code == 200
        result = json.loads(response.data)
        assert result['success'] is True
        assert 'data' in result
        assert 'pagination' in result
    
    def test_list_music_with_public_music(self, client, app):
        """测试获取公开音乐列表"""
        # 添加一些测试音乐
        with app.app_context():
            music1 = Music(
                title='公开音乐1',
                file_url='http://example.com/music1.mp3',
                creator_id=2,
                is_public=True,
                audit_status=AuditStatus.APPROVED
            )
            music2 = Music(
                title='公开音乐2',
                file_url='http://example.com/music2.mp3',
                creator_id=2,
                is_public=True,
                audit_status=AuditStatus.PENDING,
                genre='流行'
            )
            music3 = Music(
                title='私密音乐',
                file_url='http://example.com/music3.mp3',
                creator_id=2,
                is_public=False,
                audit_status=AuditStatus.APPROVED
            )
            from src.models.models import db
            db.session.add_all([music1, music2, music3])
            db.session.commit()
        
        response = client.get('/api/music/list')
        
        assert response.status_code == 200
        result = json.loads(response.data)
        assert result['success'] is True
        # 包括conftest中创建的测试音乐（默认is_public=True）
        assert len(result['data']) >= 2
        
        # 检查返回字段
        music = result['data'][0]
        assert 'id' in music
        assert 'title' in music
        assert 'file_url' in music
        assert 'cover_url' in music
        assert 'genre' in music
        assert 'creator_id' in music
        assert 'audit_status' in music
    
    def test_list_music_pagination(self, client, app):
        """测试音乐列表分页"""
        # 添加多个测试音乐
        with app.app_context():
            from src.models.models import db
            for i in range(25):
                music = Music(
                    title=f'音乐{i}',
                    file_url=f'http://example.com/music{i}.mp3',
                    creator_id=2,
                    is_public=True,
                    audit_status=AuditStatus.APPROVED
                )
                db.session.add(music)
            db.session.commit()
        
        # 第一页
        response = client.get('/api/music/list?page=1&per_page=10')
        result = json.loads(response.data)
        assert len(result['data']) == 10
        assert result['pagination']['page'] == 1
        assert result['pagination']['per_page'] == 10
        assert result['pagination']['total'] >= 25  # 至少有25个
        assert result['pagination']['pages'] >= 3
        
        # 第二页
        response = client.get('/api/music/list?page=2&per_page=10')
        result = json.loads(response.data)
        assert len(result['data']) == 10
        assert result['pagination']['page'] == 2
    
    def test_list_music_filter_by_genre(self, client, app):
        """测试按类型筛选音乐"""
        with app.app_context():
            from src.models.models import db
            music1 = Music(
                title='流行音乐',
                file_url='http://example.com/pop.mp3',
                creator_id=2,
                is_public=True,
                genre='流行',
                audit_status=AuditStatus.APPROVED
            )
            music2 = Music(
                title='摇滚音乐',
                file_url='http://example.com/rock.mp3',
                creator_id=2,
                is_public=True,
                genre='摇滚',
                audit_status=AuditStatus.APPROVED
            )
            db.session.add_all([music1, music2])
            db.session.commit()
        
        response = client.get('/api/music/list?genre=流行')
        result = json.loads(response.data)
        assert result['success'] is True
        assert len(result['data']) == 1
        assert result['data'][0]['genre'] == '流行'
    
    def test_list_music_filter_by_audit_status(self, client, app):
        """测试按审核状态筛选音乐"""
        with app.app_context():
            from src.models.models import db
            music1 = Music(
                title='已审核音乐',
                file_url='http://example.com/approved.mp3',
                creator_id=2,
                is_public=True,
                audit_status=AuditStatus.APPROVED
            )
            music2 = Music(
                title='待审核音乐',
                file_url='http://example.com/pending.mp3',
                creator_id=2,
                is_public=True,
                audit_status=AuditStatus.PENDING
            )
            db.session.add_all([music1, music2])
            db.session.commit()
        
        response = client.get('/api/music/list?audit_status=APPROVED')
        result = json.loads(response.data)
        assert result['success'] is True
        assert all(m['audit_status'] == '已通过' for m in result['data'])
    
    def test_list_music_invalid_audit_status(self, client):
        """测试无效的审核状态筛选"""
        response = client.get('/api/music/list?audit_status=INVALID')
        assert response.status_code == 400
        result = json.loads(response.data)
        assert result['success'] is False
    
    def test_get_music_detail_success(self, client, app):
        """测试成功获取音乐详情"""
        with app.app_context():
            from src.models.models import db
            music = Music(
                title='详情测试音乐',
                description='详细描述',
                file_url='http://example.com/detail.mp3',
                cover_url='http://example.com/cover.jpg',
                genre='流行',
                creator_id=2,
                is_public=True,
                audit_status=AuditStatus.APPROVED
            )
            db.session.add(music)
            db.session.commit()
            music_id = music.id
        
        response = client.get(f'/api/music/{music_id}')
        
        assert response.status_code == 200
        result = json.loads(response.data)
        assert result['success'] is True
        assert result['data']['title'] == '详情测试音乐'
        assert result['data']['description'] == '详细描述'
        assert 'upload_time' in result['data']
        assert 'price' in result['data']
    
    def test_get_music_detail_not_found(self, client):
        """测试获取不存在的音乐详情"""
        response = client.get('/api/music/99999')
        
        assert response.status_code == 404
        result = json.loads(response.data)
        assert result['success'] is False
        assert '不存在' in result['message']
    
    def test_get_music_detail_private(self, client, app):
        """测试获取私密音乐详情"""
        with app.app_context():
            from src.models.models import db
            music = Music(
                title='私密音乐',
                file_url='http://example.com/private.mp3',
                creator_id=2,
                is_public=False,
                audit_status=AuditStatus.APPROVED
            )
            db.session.add(music)
            db.session.commit()
            music_id = music.id
        
        response = client.get(f'/api/music/{music_id}')
        
        assert response.status_code == 403
        result = json.loads(response.data)
        assert result['success'] is False
        assert '不可访问' in result['message']
