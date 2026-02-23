export default defineAppConfig({
  pages: [
    "pages/home/index",
    "pages/list/index",
    "pages/detail/index",
    "pages/map/index",
  ],
  plugins: {
    citySelector: {
      version: "1.0.3",
      provider: "wx63ffb7b7894e99ae",
    },
  },
  permission: {
    "scope.userFuzzyLocation": {
      desc: "您的城市信息将用于小程序定位",
    },
    "scope.userLocation": {
      desc: "我们需要您的位置以展示附近的酒店并计算距离",
    },
  },
  requiredPrivateInfos: ["getLocation", "chooseLocation"],
  darkmode: true,
});
