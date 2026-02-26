# API 接口文档

本文档用于前后端接口联调。

## 基础信息
- **Base URL**: (请根据实际环境配置，如 `http://localhost:3000`或服务器地址)
- **API Prefix**: `/api/home`
- **数据格式**: JSON

### 通用响应结构
后端接口应返回以下标准 JSON 结构：

```typescript
interface ApiResponse<T> {
  success: boolean; // 请求是否成功
  data: T;          // 业务数据
  message?: string; // 错误信息或提示
  code?: number;    // 业务状态码
}
```

> **注意**: 下文中的“响应内容”均指代 `data` 字段中的内容。

---

## 1. 首页 (Home)

### 1.1 获取主页轮播图
*   **接口地址**: `/api/home/banners`
*   **请求方式**: `GET`
*   **对应前端方法**: `getHomeBannerList` (src/api/home.ts)
*   **描述**: 获取首页顶部的轮播图列表。
*   **响应内容 (Data)**: `BannerType[]`

```json
[
  {
    "id": 1,
    "name": "酒店1",
    "imgUrl": "https://example.com/banner1.jpg"
  }
]
```

---

## 2. 列表页 (List)

### 2.1 分页获取酒店列表（筛选）
*   **接口地址**: `/api/home/search`
*   **请求方式**: `POST`
*   **对应前端方法**: `getFilteredHotelListByPage` (src/api/list.ts)
*   **描述**: 根据筛选条件分页获取酒店列表。
*   **请求参数 (Body)**:

> 可选的筛选项，如果传输值为 null 或不传，则表示不进行限制。

```json
{
  "location": "上海",       // (可选) 城市/地区名称
  "latitude": 31.230525,    // (可选) 当前位置纬度
  "longitude": 121.473667,  // (可选) 当前位置经度
  "currentPage": 1,         // (必填) 当前页码
  "pageSize": 10,           // (必填) 每页数量
  "hotelName": "和平饭店",   // (可选) 酒店名称关键词
  "rate": 5,                // (可选) 星级 (1-5)
  "priceRange": [0, 1000],  // (可选) 价格区间 [min, max]
  "distance": [0, 500],     // (可选) 距离区间 [min, max] (单位：米)
  "facilities": ["免费WiFi"], // (可选) 设施列表
  "type": "domestic"        // (可选) 酒店类型
}
```

*   **响应内容 (Data)**:

```json
{
  "list": [
    {
      "id": 101,
      "name": "上海和平饭店",
      "rate": 5,            // 星级
      "score": 4.8,         // 评分
      "address": "南京东路20号",
      "facilities": ["免费WiFi"], // 设施标签
      "price": 2888,        // 价格
      "imgUrl": "https://example.com/peace-hotel.jpg",
      "latitude": "31.24",
      "longitude": "121.49"
    }
  ],
  "total": 100,             // 总条数
  "currentPage": 1,         // 当前页码
  "hasMore": true           // 是否有更多数据
}
```

---

## 3. 详情页 (Detail)

### 3.1 获取酒店详情
*   **接口地址**: `/api/home/hotels/{hotelId}`
*   **请求方式**: `GET`
*   **对应前端方法**: `getHotelDetailById` (src/api/detail.ts)
*   **描述**: 获取酒店的基础详情信息。
*   **路径参数**:
    *   `hotelId`: 酒店ID
*   **响应内容 (Data)**: `DetailInfoType`

```json
{
  "id": 101,
  "name": "上海和平饭店",
  "imgList": ["url1", "url2"], // 酒店轮播图
  "rate": 5,                   // 星级
  "address": "南京东路20号",
  "price": 2888,
  "description": "位于虹桥枢纽核心区，交通便利。",
  "contactPhone": "021-88888888",
  "facilities": ["免费WiFi"]
}
```

### 3.2 获取酒店房型列表
*   **接口地址**: `/api/home/hotels/{hotelId}/rooms`
*   **请求方式**: `GET`
*   **对应前端方法**: `getHotelRoomListById` (src/api/detail.ts)
*   **描述**: 获取酒店的房型列表。
*   **路径参数**:
    *   `hotelId`: 酒店ID
*   **响应内容 (Data)**: `RoomType[]`

```json
[
  {
    "id": 2001,
    "name": "费尔蒙大床房",
    "imageUrl": "https://example.com/room1.jpg",
    "bedInfo": {
      "number": 1,  // 床的数量
      "size": 1.8   // 床的尺寸
    },
    "area": 45,   // 面积
    "occupancy": 2, // 入住人数
    "floor": [5, 8], // 楼层范围
    "canCancel": true,      // 是否可以取消
    "instantConfirm": true, // 是否立即确认
    "stock": 2,     // 剩余数量
    "price": 3200   // 价格
  }
]
```
