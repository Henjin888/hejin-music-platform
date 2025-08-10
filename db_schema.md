# 数据库模型设计方案

## 1. 用户（User）
- id (PK)
- username
- email
- password_hash
- avatar_url
- role (普通/创作者/管理员)
- created_at
- updated_at

## 2. 音乐作品（Music）
- id (PK)
- title
- description
- file_url
- cover_url
- genre
- creator_id (FK: User)
- upload_time
- audit_status
- price
- is_public

## 3. 订单（Order）
- id (PK)
- user_id (FK: User)
- music_id (FK: Music)
- payment_method
- status (待支付/已支付/取消)
- created_at
- completed_at

## 4. 会员订阅（Subscription）
- id (PK)
- user_id (FK: User)
- type (月度/年度/VIP)
- start_date
- end_date
- status

## 5. 举报与审核（Report）
- id (PK)
- reporter_id (FK: User)
- music_id (FK: Music)
- reason
- status (待处理/已处理/驳回)
- created_at
- processed_at

## 6. 黑名单（Blacklist）
- id (PK)
- user_id (FK: User)
- reason
- start_date
- end_date

## 7. 支付记录（Payment）
- id (PK)
- order_id (FK: Order)
- amount
- method
- transaction_id
- status
- paid_at

## 8. 搜索历史（SearchHistory）
- id (PK)
- user_id (FK: User)
- keyword
- search_type (music|users|all)
- search_count
- last_searched_at
- created_at

## 9. 搜索统计（SearchStats）
- id (PK)
- keyword
- search_count
- period_date
- created_at

## 10. 音乐标签（MusicTags）
- id (PK)
- music_id (FK: Music)
- tag_name
- created_at

## 11. 用户关注（UserFollow）
- id (PK)
- follower_id (FK: User)
- following_id (FK: User)
- created_at
