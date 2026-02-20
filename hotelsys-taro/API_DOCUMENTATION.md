# API 接口文档

本文档基于 `src/api/` 目录下的 TypeScript 文件生成，用于前后端接口联调。

## 基础信息
- **Base URL**: (请根据实际环境配置)
- **数据格式**: JSON

---

## 1. 首页 (Home)

### 1.1 获取主页轮播图
*   **接口地址**: `/home/banners`
*   **请求方式**: `GET`
*   **对应前端方法**: `getHomeBannerList` (src/api/home.ts)
*   **描述**: 获取首页顶部的轮播图列表。
*   **响应内容**: `BannerType[]`

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
*   **接口地址**: `/hotels/search`
*   **请求方式**: `POST`
*   **对应前端方法**: `getFilteredHotelListByPage` (src/api/list.ts)
*   **描述**: 根据筛选条件分页获取酒店列表。
*   **请求参数 (Body)**:

> 可选的筛选项，如果传输值为null，则表示不进行限制。例如rate为null，表示对星级没有筛选

```json
{
  "location": "上海",     // (可选) 地区 （或者传城市）
  "rate": 4,                // (可选) 星级筛选
  "priceRange": [900,1000],               // (可选) 价格筛选 （[最低价，最高价]）
  "facilities": ["免费WiFi"],           // (可选) 设施筛选
  "distance": [100, 500],              // (可选) 距离筛选（[最近距离价，最远价]）
  "currentPage": 1,           // 当前页码 (必填)
  "pageSize": 10,              // 每页数量 (必填)
  "latitude": 31.230525,  // 纬度（用于距离筛选）
  "longitude": 121.473667, //经度（用于距离筛选）
  "type": "domestic",       // （可选）类型（国内、海外、钟点房、民宿）
  "hotelName": "美轮美奂",    // （可选）酒店名称
}
```

*   **响应内容**:

```json
{
  "list": [
    {
      "id": 101,
      "name": "上海和平饭店",
      "rate": 5, // 星级
      "address": "南京东路20号",
      "facilities": ["免费WiFi"], //设施标签
      "price": 2888, //所有房型价格的最低价
      "imgUrl": "https://example.com/peace-hotel.jpg"
    }
  ],
  "total": 100,               // 总条数
  "currentPage": 1,           // 当前页码
  "hasMore": true             // 是否有更多数据
}
```

---

## 3. 详情页 (Detail)

### 3.1 获取酒店详情
*   **接口地址**: `/hotels/{hotelId}`
*   **请求方式**: `GET`
*   **对应前端方法**: `getHotelDetailById` (src/api/detail.ts)
*   **描述**: 获取酒店的基础详情信息。
*   **路径参数**:
    *   `hotelId`: 酒店ID
*   **响应内容**: `DetailInfoType`

```json
{
  "id": 101,
  "name": "上海和平饭店",
  "imgList": ["url1", "url2"], // 酒店展示图片
  "rate": 5, // 星级，从0到5
  "address": "南京东路20号",
  "price": 2888,
  "description": "位于虹桥枢纽核心区，交通便利。",
  "contactPhone": "021-88888888",
  "facilities": ["免费WiFi"], 
}
```

### 3.2 获取酒店房型列表
*   **接口地址**: `/hotels/{hotelId}/rooms`
*   **请求方式**: `GET`
*   **对应前端方法**: `getHotelRoomListById` (src/api/detail.ts)
*   **描述**: 获取酒店的房型列表。
*   **路径参数**:
    *   `hotelId`: 酒店ID
*   **响应内容**: `RoomType[]`

```json
[
  {
    "id": 2001,
    "name": "费尔蒙大床房",
    "imageUrl": "https://example.com/room1.jpg",
    "bedInfo": {
      "number": 1, //床的数量
      "size": 1.8, //床的尺寸
    },
    "area": 45, //面积 45㎡
    "occupancy": 2, // 入住人数
    "floor": [5,8], // 层数，表示5-8层
    "canCancel": true, // 是否可以取消
    "instantConfirm": true, //是否立即确认
    "stock": 2, //剩余数量
    "price": 3200 //价格
  }
]
```