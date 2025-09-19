import pytest
import json
from src.models.models import Report, Blacklist, ReportStatus

class TestModerationAPI:
    """内容审核API测试"""
    
    def test_health_check(self, client):
        """测试健康检查"""
        response = client.get('/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
    
    def test_create_report_success(self, client, auth_headers):
        """测试成功创建举报"""
        data = {
            'music_id': 1,
            'reason': '违规内容'
        }
        response = client.post('/api/report/create',
                             headers=auth_headers['user'],
                             data=json.dumps(data),
                             content_type='application/json')
        
        assert response.status_code == 200
        result = json.loads(response.data)
        assert result['success'] is True
        assert 'report_id' in result
    
    def test_create_report_invalid_music(self, client, auth_headers):
        """测试举报不存在的音乐"""
        data = {
            'music_id': 999,
            'reason': '违规内容'
        }
        response = client.post('/api/report/create',
                             headers=auth_headers['user'],
                             data=json.dumps(data),
                             content_type='application/json')
        
        assert response.status_code == 400
        result = json.loads(response.data)
        assert result['success'] is False
        assert '不存在' in result['message']
    
    def test_create_report_duplicate(self, client, auth_headers):
        """测试重复举报"""
        data = {
            'music_id': 1,
            'reason': '违规内容'
        }
        # 第一次举报
        client.post('/api/report/create',
                   headers=auth_headers['user'],
                   data=json.dumps(data),
                   content_type='application/json')
        
        # 第二次举报（应该失败）
        response = client.post('/api/report/create',
                             headers=auth_headers['user'],
                             data=json.dumps(data),
                             content_type='application/json')
        
        assert response.status_code == 400
        result = json.loads(response.data)
        assert result['success'] is False
        assert '已经举报' in result['message']
    
    def test_get_reports_admin_only(self, client, auth_headers):
        """测试只有管理员能获取举报列表"""
        # 普通用户访问应该失败
        response = client.get('/api/report/list',
                            headers=auth_headers['user'])
        assert response.status_code == 403
        
        # 管理员访问应该成功
        response = client.get('/api/report/list',
                            headers=auth_headers['admin'])
        assert response.status_code == 200
    
    def test_add_to_blacklist_admin_only(self, client, auth_headers):
        """测试只有管理员能添加黑名单"""
        data = {
            'user_id': 2,
            'reason': '违规用户'
        }
        
        # 普通用户访问应该失败
        response = client.post('/api/blacklist/add',
                             headers=auth_headers['user'],
                             data=json.dumps(data),
                             content_type='application/json')
        assert response.status_code == 403
        
        # 管理员访问应该成功
        response = client.post('/api/blacklist/add',
                             headers=auth_headers['admin'],
                             data=json.dumps(data),
                             content_type='application/json')
        assert response.status_code == 200
        result = json.loads(response.data)
        assert result['success'] is True
    
    def test_music_audit_admin_only(self, client, auth_headers):
        """测试只有管理员能审核音乐"""
        data = {
            'action': 'approve',
            'comment': '审核通过'
        }
        
        # 普通用户访问应该失败
        response = client.post('/api/music/1/audit',
                             headers=auth_headers['user'],
                             data=json.dumps(data),
                             content_type='application/json')
        assert response.status_code == 403
        
        # 管理员访问应该成功
        response = client.post('/api/music/1/audit',
                             headers=auth_headers['admin'],
                             data=json.dumps(data),
                             content_type='application/json')
        assert response.status_code == 200
    
    def test_unauthorized_access(self, client):
        """测试未授权访问"""
        # 无token访问应该失败
        response = client.get('/api/report/list')
        assert response.status_code == 401
        
        response = client.post('/api/report/create',
                             data=json.dumps({'music_id': 1, 'reason': 'test'}),
                             content_type='application/json')
        assert response.status_code == 401
    
    def test_invalid_json_data(self, client, auth_headers):
        """测试无效的JSON数据"""
        response = client.post('/api/report/create',
                             headers=auth_headers['user'],
                             data='invalid json',
                             content_type='application/json')
        assert response.status_code == 400