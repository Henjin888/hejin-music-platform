import pytest
from datetime import datetime, timedelta
from src.services.moderation_service import ContentModerationService
from src.models.models import db, User, Music, Report, Blacklist, ContentFilter
from src.models.models import UserRole, AuditStatus, ReportStatus

class TestModerationService:
    """内容审核服务测试"""
    
    def test_submit_report_success(self, app):
        """测试成功提交举报"""
        with app.app_context():
            result = ContentModerationService.submit_report(
                reporter_id=2,  # normal user
                music_id=1,
                reason="包含不当内容"
            )
            
            assert result['success'] is True
            assert 'report_id' in result
            
            # 验证数据库中的记录
            report = Report.query.get(result['report_id'])
            assert report is not None
            assert report.reason == "包含不当内容"
            assert report.status == ReportStatus.PENDING
    
    def test_submit_report_nonexistent_music(self, app):
        """测试举报不存在的音乐"""
        with app.app_context():
            result = ContentModerationService.submit_report(
                reporter_id=2,
                music_id=999,
                reason="测试举报"
            )
            
            assert result['success'] is False
            assert "不存在" in result['message']
    
    def test_submit_duplicate_report(self, app):
        """测试重复举报"""
        with app.app_context():
            # 第一次举报
            ContentModerationService.submit_report(
                reporter_id=2,
                music_id=1,
                reason="第一次举报"
            )
            
            # 第二次举报同一个音乐
            result = ContentModerationService.submit_report(
                reporter_id=2,
                music_id=1,
                reason="第二次举报"
            )
            
            assert result['success'] is False
            assert "已经举报" in result['message']
    
    def test_add_to_blacklist(self, app):
        """测试添加用户到黑名单"""
        with app.app_context():
            result = ContentModerationService.add_to_blacklist(
                user_id=2,
                admin_id=1,
                reason="违规行为",
                end_date=datetime.utcnow() + timedelta(days=30)
            )
            
            assert result['success'] is True
            
            # 验证用户确实被加入黑名单
            assert ContentModerationService.is_user_blacklisted(2) is True
            
            # 验证用户的音乐被设为不公开
            user_music = Music.query.filter_by(creator_id=2).first()
            if user_music:
                assert user_music.is_public is False
    
    def test_blacklisted_user_cannot_report(self, app):
        """测试黑名单用户无法举报"""
        with app.app_context():
            # 先将用户加入黑名单
            ContentModerationService.add_to_blacklist(
                user_id=2,
                admin_id=1,
                reason="测试黑名单"
            )
            
            # 尝试举报
            result = ContentModerationService.submit_report(
                reporter_id=2,
                music_id=1,
                reason="测试举报"
            )
            
            assert result['success'] is False
            assert "黑名单" in result['message']
    
    def test_process_report(self, app):
        """测试处理举报"""
        with app.app_context():
            # 先创建举报
            submit_result = ContentModerationService.submit_report(
                reporter_id=2,
                music_id=1,
                reason="测试举报"
            )
            
            report_id = submit_result['report_id']
            
            # 处理举报
            result = ContentModerationService.process_report(
                report_id=report_id,
                admin_id=1,
                action="approve",
                comment="举报属实"
            )
            
            assert result['success'] is True
            
            # 验证举报状态已更新
            report = Report.query.get(report_id)
            assert report.status == ReportStatus.PROCESSED
            assert report.processed_at is not None
            assert report.admin_comment == "举报属实"
    
    def test_audit_music(self, app):
        """测试音乐审核"""
        with app.app_context():
            result = ContentModerationService.audit_music(
                music_id=1,
                admin_id=1,
                action="approve",
                comment="内容合规"
            )
            
            assert result['success'] is True
            
            # 验证音乐状态已更新
            music = Music.query.get(1)
            assert music.audit_status == AuditStatus.APPROVED
            assert music.is_public is True
    
    def test_audit_music_reject(self, app):
        """测试拒绝音乐"""
        with app.app_context():
            result = ContentModerationService.audit_music(
                music_id=1,
                admin_id=1,
                action="reject",
                comment="内容违规"
            )
            
            assert result['success'] is True
            
            # 验证音乐状态已更新
            music = Music.query.get(1)
            assert music.audit_status == AuditStatus.REJECTED
            assert music.is_public is False
    
    def test_add_content_filter(self, app):
        """测试添加内容过滤器"""
        with app.app_context():
            result = ContentModerationService.add_content_filter(
                keyword="违禁词",
                filter_type="both",
                action="block",
                admin_id=1
            )
            
            assert result['success'] is True
            
            # 验证过滤器已添加
            filter_rule = ContentFilter.query.filter_by(keyword="违禁词").first()
            assert filter_rule is not None
            assert filter_rule.filter_type == "both"
            assert filter_rule.action == "block"
    
    def test_auto_content_filtering(self, app):
        """测试自动内容过滤"""
        with app.app_context():
            # 先添加过滤器
            ContentModerationService.add_content_filter(
                keyword="测试违禁词",
                filter_type="title",
                action="block",
                admin_id=1
            )
            
            # 创建包含违禁词的音乐
            bad_music = Music(
                title="包含测试违禁词的标题",
                description="正常描述",
                file_url="http://example.com/bad.mp3",
                creator_id=3
            )
            db.session.add(bad_music)
            db.session.commit()
            
            # 触发自动审核
            ContentModerationService._auto_moderate_music(bad_music.id)
            
            # 验证音乐被自动拒绝
            db.session.refresh(bad_music)
            assert bad_music.audit_status == AuditStatus.REJECTED
            assert bad_music.is_public is False
    
    def test_get_reports_pagination(self, app):
        """测试获取举报列表分页"""
        with app.app_context():
            # 创建多个举报 - 需要创建不同的音乐或者不同的用户
            # 第一个举报
            ContentModerationService.submit_report(
                reporter_id=2,
                music_id=1,
                reason="第一个举报"
            )
            
            # 创建额外的音乐作品来举报
            for i in range(2, 6):
                test_music = Music(
                    title=f'Test Music {i}',
                    description='Test Description',
                    file_url=f'http://example.com/music{i}.mp3',
                    creator_id=3,
                    audit_status=AuditStatus.PENDING
                )
                db.session.add(test_music)
                db.session.commit()
                
                ContentModerationService.submit_report(
                    reporter_id=2,
                    music_id=i,
                    reason=f"举报 {i}"
                )
            
            result = ContentModerationService.get_reports(page=1, per_page=3)
            
            assert result['success'] is True
            assert len(result['reports']) <= 3
            assert result['pagination']['total'] >= 5
    
    def test_non_admin_operations(self, app):
        """测试非管理员操作"""
        with app.app_context():
            # 先创建一个举报
            submit_result = ContentModerationService.submit_report(
                reporter_id=2,
                music_id=1,
                reason="测试举报"
            )
            
            report_id = submit_result['report_id']
            
            # 普通用户尝试处理举报
            result = ContentModerationService.process_report(
                report_id=report_id,
                admin_id=2,  # 普通用户ID
                action="approve"
            )
            
            assert result['success'] is False
            assert "权限" in result['message']
            
            # 普通用户尝试添加黑名单
            result = ContentModerationService.add_to_blacklist(
                user_id=3,
                admin_id=2,  # 普通用户ID
                reason="测试"
            )
            
            assert result['success'] is False
            assert "权限" in result['message']