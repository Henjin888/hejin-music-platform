# 搜索API使用示例

## 1. 基础音乐搜索
```http
GET /api/search/music?keyword=流行音乐&page=1&limit=20
```

**响应示例**:
```json
{
  "results": [
    {
      "id": 123,
      "title": "夏日清新",
      "artist": {
        "id": 45,
        "name": "音乐创作者A",
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "cover_url": "https://example.com/cover.jpg",
      "duration": 240,
      "genre": "pop",
      "price": 9.99,
      "play_count": 1500,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "total_pages": 8,
  "search_time": 0.05
}
```

## 2. 高级搜索筛选
```http
GET /api/search/music?keyword=摇滚&genre=rock&min_price=0&max_price=50&sort_by=play_count&order=desc&page=1&limit=10
```

## 3. 用户搜索
```http
GET /api/search/users?keyword=音乐创作&role=creator&verified=true&page=1&limit=15
```

## 4. 搜索建议
```http
GET /api/search/suggestions?query=流行&type=music
```

**响应示例**:
```json
{
  "suggestions": [
    {
      "text": "流行音乐",
      "type": "music",
      "highlight": "<em>流行</em>音乐",
      "count": 245
    },
    {
      "text": "流行歌手",
      "type": "user", 
      "highlight": "<em>流行</em>歌手",
      "count": 89
    }
  ]
}
```

## 5. 热门搜索
```http
GET /api/search/trending?period=day&limit=10
```

## 6. 搜索历史管理
### 保存搜索历史
```http
POST /api/search/history
Content-Type: application/json

{
  "keyword": "古典音乐",
  "search_type": "music",
  "user_id": 123
}
```

### 获取搜索历史
```http
GET /api/search/history?user_id=123&limit=20
```

### 删除搜索历史
```http
DELETE /api/search/history/456
```