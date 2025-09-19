from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum
from decimal import Decimal
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.types import DECIMAL

db = SQLAlchemy()

class UserRole(Enum):
    NORMAL = "普通"
    CREATOR = "创作者"
    ADMIN = "管理员"

class AuditStatus(Enum):
    PENDING = "待审核"
    APPROVED = "已通过"
    REJECTED = "已拒绝"
    REVIEWING = "审核中"

class ReportStatus(Enum):
    PENDING = "待处理"
    PROCESSED = "已处理"
    REJECTED = "驳回"

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    avatar_url = db.Column(db.String(255), nullable=True)
    role = db.Column(db.Enum(UserRole), default=UserRole.NORMAL, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    created_music = db.relationship('Music', backref='creator', lazy=True, foreign_keys='Music.creator_id')
    reports_made = db.relationship('Report', backref='reporter', lazy=True, foreign_keys='Report.reporter_id')
    blacklist_records = db.relationship('Blacklist', backref='user', lazy=True, foreign_keys='Blacklist.user_id')
    processed_reports = db.relationship('Report', backref='admin_processor', lazy=True, foreign_keys='Report.processed_by_admin_id')
    created_blacklists = db.relationship('Blacklist', backref='admin_creator', lazy=True, foreign_keys='Blacklist.created_by_admin_id')
    created_filters = db.relationship('ContentFilter', backref='admin_creator', lazy=True, foreign_keys='ContentFilter.created_by_admin_id')

class Music(db.Model):
    __tablename__ = 'music'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    file_url = db.Column(db.String(500), nullable=False)
    cover_url = db.Column(db.String(500), nullable=True)
    genre = db.Column(db.String(50), nullable=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    upload_time = db.Column(db.DateTime, default=datetime.utcnow)
    audit_status = db.Column(db.Enum(AuditStatus), default=AuditStatus.PENDING, nullable=False)
    price = db.Column(DECIMAL(10, 2), nullable=True)
    is_public = db.Column(db.Boolean, default=True, nullable=False)
    
    # Relationships
    reports = db.relationship('Report', backref='music', lazy=True)

class Report(db.Model):
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    music_id = db.Column(db.Integer, db.ForeignKey('music.id'), nullable=False)
    reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum(ReportStatus), default=ReportStatus.PENDING, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    processed_at = db.Column(db.DateTime, nullable=True)
    admin_comment = db.Column(db.Text, nullable=True)
    processed_by_admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

class Blacklist(db.Model):
    __tablename__ = 'blacklists'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reason = db.Column(db.Text, nullable=False)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_by_admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def is_currently_blacklisted(self):
        if not self.is_active:
            return False
        if self.end_date is None:
            return True
        return datetime.utcnow() <= self.end_date

class ContentFilter(db.Model):
    __tablename__ = 'content_filters'
    
    id = db.Column(db.Integer, primary_key=True)
    keyword = db.Column(db.String(100), nullable=False)
    filter_type = db.Column(db.String(50), nullable=False)  # 'title', 'description', 'both'
    action = db.Column(db.String(50), nullable=False)  # 'block', 'flag', 'moderate'
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by_admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)