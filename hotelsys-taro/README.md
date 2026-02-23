# 易宿酒店预订小程序 (Hotelsys Taro)

本项目是一个基于 [Taro 4](https://taro.jd.com/) + React + TypeScript 开发的酒店预订多端小程序。项目采用了现代化的前端技术栈，支持微信小程序、H5 等多端发布，并集成了深色模式、多语言国际化等功能。

## ✨ 功能特性

- **首页搜索**: 支持城市选择、入离日期选择、价格/星级筛选、关键词搜索。
- **酒店列表**: 
  - 支持按距离、价格、星级、设施等多维度筛选。
  - 虚拟列表/无限滚动加载，性能优化。
  - 骨架屏加载状态。
- **酒店详情**:
  - 酒店图册、基本信息、设施展示。
  - 评价列表（支持展开/收起动画）。
  - 房型列表展示。
  - 地图定位与导航。
- **地图模式**: 支持地图模式查看周边酒店分布。
- **多主题支持**: 内置深色模式（Dark Mode）与浅色模式切换。
- **国际化 (i18n)**: 支持中英文语言切换。
- **自定义组件**: 封装了日历选择、价格滑块、筛选栏、弹窗等高复用组件。

## 🛠 技术栈

- **核心框架**: [Taro 4.x](https://taro.jd.com/)
- **UI 库**: React 18
- **语言**: TypeScript
- **状态管理**: [Zustand](https://github.com/pmndrs/zustand)
- **样式方案**: 
  - [Tailwind CSS](https://tailwindcss.com/) (配合 `weapp-tailwindcss` 适配小程序)
  - Sass
  - [@nutui/icons-react-taro](https://nutui.jd.com/)
- **工具库**:
  - [Day.js](https://day.js.org/) (日期处理)
  - [i18next](https://www.i18next.com/) (国际化)

## 📂 项目结构

```
src/
├── api/                 # 接口请求层
├── assets/              # 静态资源 (SVG, Images)
├── components/          # 公共组件
│   ├── CustomRange/     # 自定义双向滑块
│   ├── CalendarSelect/  # 日历选择组件
│   ├── CustomPopup/     # 通用弹窗
│   ├── PageWrapper/     # 页面容器（主题/全局配置）
│   └── ...
├── constant/            # 常量定义
├── enum/                # 枚举定义
├── hooks/               # 自定义 Hooks (useCitySelect, useDebounce等)
├── locales/             # 国际化语言包 (en.json, zh.json)
├── mock/                # Mock 数据
├── pages/               # 页面视图
│   ├── home/            # 首页
│   ├── list/            # 酒店列表页
│   ├── detail/          # 酒店详情页
│   └── map/             # 地图页
├── store/               # Zustand 状态管理
│   ├── searchStore.ts   # 搜索条件状态
│   ├── themeStore.ts    # 主题状态
│   └── ...
├── utils/               # 工具函数 (日期, 格式化, 请求封装)
├── app.config.ts        # 小程序全局配置
└── app.tsx              # 入口文件
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发环境

**微信小程序:**
```bash
npm run dev:weapp
```
启动后请使用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 导入 `dist/` 目录进行预览。

**H5 预览:**
```bash
npm run dev:h5
```
启动后访问 `http://localhost:10086` (默认端口)。

### 3. 构建生产环境

```bash
npm run build:weapp  # 构建微信小程序
npm run build:h5     # 构建 H5
```

## 📝 开发注意事项

1. **样式开发**: 
   - 推荐优先使用 Tailwind CSS 类名进行布局。
   - 涉及 rpx 转换或复杂动画时可结合 Sass 模块。
2. **图标使用**: 
   - 项目主要使用 SVG 图标和 `@nutui/icons-react-taro`。
3. **Mock 数据**:
   - 当前项目部分接口使用本地 Mock 数据（位于 `src/mock`），实际对接时请在 `src/api` 中替换为真实接口。
4. **组件开发**:
   - 自定义组件若涉及 `Taro.createSelectorQuery`，请注意在自定义组件中使用 `useScope` 获取作用域。

## 📄 License

MIT
