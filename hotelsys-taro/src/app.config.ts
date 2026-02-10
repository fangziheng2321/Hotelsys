export default defineAppConfig({
  pages: ["pages/home/index", "pages/list/index", "pages/detail/index"],
  plugins: {
    citySelector: {
      version: "1.0.3",
      provider: "wx63ffb7b7894e99ae",
    },
  },
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于小程序定位",
    },
  },
});
