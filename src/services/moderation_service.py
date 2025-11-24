from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models.models import db, User, Music, Report, Blacklist, ContentFilter
from ..models.models import ReportStatus, AuditStatus, UserRole
import re

class ContentModerationService:
    """内容审核服务"""
    
    @staticmethod
    def submit_report(reporter_id: int, music_id: int, reason: str) -> Dict[str, Any]:
        """提交举报"""
        try:
            # 检查举报者是否在黑名单中
            if ContentModerationService.is_user_blacklisted(reporter_id):
                return {"success": False, "message": "用户已被列入黑名单，无法提交举报"}
            
            # 检查音乐是否存在
            music = Music.query.get(music_id)
            if not music:
                return {"success": False, "message": "音乐作品不存在"}
            
            # 检查是否已经举报过
            existing_report = Report.query.filter_by(
                reporter_id=reporter_id,
                music_id=music_id,
                status=ReportStatus.PENDING
            ).first()
            
            if existing_report:
                return {"success": False, "message": "您已经举报过此作品"}
            
            report = Report(
                reporter_id=reporter_id,
                music_id=music_id,
                reason=reason,
                status=ReportStatus.PENDING
            )
            
            db.session.add(report)
            db.session.commit()
            
            # 自动审核音乐内容
            ContentModerationService._auto_moderate_music(music_id)
            
            return {
                "success": True,
                "report_id": report.id,
                "status": report.status.value
            }
        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"提交举报失败: {str(e)}"}
    
    @staticmethod
    def get_reports(status: Optional[str] = None, page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """获取举报列表（管理员用）"""
        try:
            query = Report.query.join(Music).join(User, Report.reporter_id == User.id)
            
            if status:
                try:
                    status_enum = ReportStatus(status)
                    query = query.filter(Report.status == status_enum)
                except ValueError:
                    return {"success": False, "message": "无效的状态值"}
            
            pagination = query.paginate(
                page=page, per_page=per_page, error_out=False
            )
            
            reports = []
            for report in pagination.items:
                reports.append({
                    "id": report.id,
                    "reporter": {
                        "id": report.reporter.id,
                        "username": report.reporter.username
                    },
                    "music": {
                        "id": report.music.id,
                        "title": report.music.title,
                        "creator": report.music.creator.username
                    },
                    "reason": report.reason,
                    "status": report.status.value,
                    "created_at": report.created_at.isoformat(),
                    "processed_at": report.processed_at.isoformat() if report.processed_at else None,
                    "admin_comment": report.admin_comment
                })
            
            return {
                "success": True,
                "reports": reports,
                "pagination": {
                    "page": page,
                    "per_page": per_page,
                    "total": pagination.total,
                    "pages": pagination.pages
                }
            }
        except Exception as e:
            return {"success": False, "message": f"获取举报列表失败: {str(e)}"}
    
    @staticmethod
    def process_report(report_id: int, admin_id: int, action: str, comment: str = "") -> Dict[str, Any]:
        """处理举报（管理员操作）"""
        try:
            report = Report.query.get(report_id)
            if not report:
                return {"success": False, "message": "举报不存在"}
            
            admin = User.query.get(admin_id)
            if not admin or admin.role != UserRole.ADMIN:
                return {"success": False, "message": "无权限操作"}
            
            if action == "approve":
                report.status = ReportStatus.PROCESSED
                # 将相关音乐标记为需要审核
                music = Music.query.get(report.music_id)
                if music:
                    music.audit_status = AuditStatus.REVIEWING
            elif action == "reject":
                report.status = ReportStatus.REJECTED
            else:
                return {"success": False, "message": "无效的操作"}
            
            report.processed_at = datetime.utcnow()
            report.processed_by_admin_id = admin_id
            report.admin_comment = comment
            
            db.session.commit()
            
            return {"success": True, "message": "举报已处理"}
        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"处理举报失败: {str(e)}"}
    
    @staticmethod
    def add_to_blacklist(user_id: int, admin_id: int, reason: str, end_date: Optional[datetime] = None) -> Dict[str, Any]:
        """将用户添加到黑名单"""
        try:
            admin = User.query.get(admin_id)
            if not admin or admin.role != UserRole.ADMIN:
                return {"success": False, "message": "无权限操作"}
            
            user = User.query.get(user_id)
            if not user:
                return {"success": False, "message": "用户不存在"}
            
            # 检查是否已在黑名单中
            existing_blacklist = Blacklist.query.filter_by(
                user_id=user_id,
                is_active=True
            ).first()
            
            if existing_blacklist and existing_blacklist.is_currently_blacklisted():
                return {"success": False, "message": "用户已在黑名单中"}
            
            blacklist_entry = Blacklist(
                user_id=user_id,
                reason=reason,
                end_date=end_date,
                created_by_admin_id=admin_id
            )
            
            db.session.add(blacklist_entry)
            
            # 将用户的所有音乐设为不公开
            user_music = Music.query.filter_by(creator_id=user_id).all()
            for music in user_music:
                music.is_public = False
                music.audit_status = AuditStatus.REJECTED
            
            db.session.commit()
            
            return {"success": True, "message": "用户已添加到黑名单"}
        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"添加黑名单失败: {str(e)}"}
    
    @staticmethod
    def get_blacklisted_users(page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """获取黑名单用户列表"""
        try:
            query = Blacklist.query.filter_by(is_active=True).join(User)
            pagination = query.paginate(page=page, per_page=per_page, error_out=False)
            
            blacklisted_users = []
            for blacklist in pagination.items:
                blacklisted_users.append({
                    "id": blacklist.id,
                    "user": {
                        "id": blacklist.user.id,
                        "username": blacklist.user.username,
                        "email": blacklist.user.email
                    },
                    "reason": blacklist.reason,
                    "start_date": blacklist.start_date.isoformat(),
                    "end_date": blacklist.end_date.isoformat() if blacklist.end_date else None,
                    "is_currently_active": blacklist.is_currently_blacklisted()
                })
            
            return {
                "success": True,
                "blacklisted_users": blacklisted_users,
                "pagination": {
                    "page": page,
                    "per_page": per_page,
                    "total": pagination.total,
                    "pages": pagination.pages
                }
            }
        except Exception as e:
            return {"success": False, "message": f"获取黑名单失败: {str(e)}"}
    
    @staticmethod
    def is_user_blacklisted(user_id: int) -> bool:
        """检查用户是否在黑名单中"""
        blacklist_entry = Blacklist.query.filter_by(
            user_id=user_id,
            is_active=True
        ).first()
        
        return blacklist_entry and blacklist_entry.is_currently_blacklisted()
    
    @staticmethod
    def audit_music(music_id: int, admin_id: int, action: str, comment: str = "") -> Dict[str, Any]:
        """音乐审核"""
        try:
            music = Music.query.get(music_id)
            if not music:
                return {"success": False, "message": "音乐作品不存在"}
            
            admin = User.query.get(admin_id)
            if not admin or admin.role != UserRole.ADMIN:
                return {"success": False, "message": "无权限操作"}
            
            if action == "approve":
                music.audit_status = AuditStatus.APPROVED
                music.is_public = True
            elif action == "reject":
                music.audit_status = AuditStatus.REJECTED
                music.is_public = False
            else:
                return {"success": False, "message": "无效的操作"}
            
            db.session.commit()
            
            return {"success": True, "message": f"音乐已{action}"}
        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"音乐审核失败: {str(e)}"}
    
    @staticmethod
    def _auto_moderate_music(music_id: int) -> None:
        """自动审核音乐内容"""
        try:
            music = Music.query.get(music_id)
            if not music:
                return
            
            # 获取活跃的内容过滤器
            filters = ContentFilter.query.filter_by(is_active=True).all()
            
            should_block = False
            should_flag = False
            
            for filter_rule in filters:
                text_to_check = ""
                if filter_rule.filter_type in ["title", "both"]:
                    text_to_check += music.title.lower()
                if filter_rule.filter_type in ["description", "both"] and music.description:
                    text_to_check += " " + music.description.lower()
                
                if re.search(filter_rule.keyword.lower(), text_to_check):
                    if filter_rule.action == "block":
                        should_block = True
                        break
                    elif filter_rule.action == "flag":
                        should_flag = True
            
            if should_block:
                music.audit_status = AuditStatus.REJECTED
                music.is_public = False
            elif should_flag:
                music.audit_status = AuditStatus.REVIEWING
            
            db.session.commit()
        except Exception:
            db.session.rollback()
    
    @staticmethod
    def add_content_filter(keyword: str, filter_type: str, action: str, admin_id: int) -> Dict[str, Any]:
        """添加内容过滤器"""
        try:
            admin = User.query.get(admin_id)
            if not admin or admin.role != UserRole.ADMIN:
                return {"success": False, "message": "无权限操作"}
            
            if filter_type not in ["title", "description", "both"]:
                return {"success": False, "message": "无效的过滤类型"}
            
            if action not in ["block", "flag", "moderate"]:
                return {"success": False, "message": "无效的动作类型"}
            
            content_filter = ContentFilter(
                keyword=keyword,
                filter_type=filter_type,
                action=action,
                created_by_admin_id=admin_id
            )
            
            db.session.add(content_filter)
            db.session.commit()
            
            return {"success": True, "message": "内容过滤器已添加"}
        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"添加过滤器失败: {str(e)}"}