# API接口详细设计

## 1. 用户模块
- POST /api/register
  - 注册新用户
  - 参数：username, email, password
  - 返回：{ success, user_id, message }
- POST /api/login
  - 用户登录
  - 参数：email, password
  - 返回：{ success, token, user_id, role }
- GET /api/user/{id}
  - 获取用户信息
  - 返回：{ user }

## 2. 音乐作品模块
- POST /api/music/upload
  - 上传音乐作品
  - 参数：title, description, file, cover, genre, price
  - 返回：{ success, music_id }
- GET /api/music/{id}
  - 获取指定作品详情
  - 返回：{ music }
- GET /api/music/list
  - 获取作品列表
  - 参数：page, limit, genre, keyword, sort_by, order
  - 返回：{ musics, total, page, total_pages }

## 3. 订单与支付模块
- POST /api/order/create
  - 创建订单
  - 参数：music_id, payment_method
  - 返回：{ order_id, status }
- POST /api/payment/confirm
  - 支付确认
  - 参数：order_id, payment_token
  - 返回：{ success, transaction_id }

## 4. 会员订阅模块
- POST /api/subscription/subscribe
  - 会员订阅
  - 参数：type, payment_method
  - 返回：{ subscription_id, status }
- GET /api/subscription/status
  - 查询会员状态
  - 返回：{ active, type, end_date }

## 5. 内容审核与举报模块
- POST /api/report/create
  - 举报音乐作品
  - 参数：music_id, reason
  - 返回：{ report_id, status }
- GET /api/report/list
  - 管理员获取举报列表
  - 参数：status
  - 返回：{ reports }

## 6. 黑名单管理
- POST /api/blacklist/add
  - 添加用户至黑名单
  - 参数：user_id, reason, end_date
  - 返回：{ success }
- GET /api/blacklist/list
  - 查询黑名单用户
  - 返回：{ blacklisted_users }

## 7. 搜索模块
- GET /api/search/music
  - 音乐作品搜索
  - 参数：keyword, genre, artist_id, min_price, max_price, upload_date_from, upload_date_to, sort_by, order, page, limit
  - 返回：{ results, total, page, total_pages, search_time, facets }
- GET /api/search/users
  - 用户/艺术家搜索
  - 参数：keyword, role, verified, page, limit
  - 返回：{ results, total, page, total_pages }
- GET /api/search/suggestions
  - 搜索建议/自动完成
  - 参数：query, type (music|users|all)
  - 返回：{ suggestions }
- GET /api/search/trending
  - 热门搜索词
  - 参数：period (day|week|month), limit
  - 返回：{ trending_keywords, period }
- POST /api/search/history
  - 保存用户搜索历史
  - 参数：keyword, search_type, user_id
  - 返回：{ success }
- GET /api/search/history
  - 获取用户搜索历史
  - 参数：user_id, limit
  - 返回：{ history }
- DELETE /api/search/history/{id}
  - 删除搜索历史记录
  - 返回：{ success }