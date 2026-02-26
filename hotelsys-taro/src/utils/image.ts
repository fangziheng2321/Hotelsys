import { hotelSwiper, roomImage } from "@/constant/detail";
import { bannerList } from "@/constant/home";
import { hotelImg } from "@/constant/list";
import { IMG_BASE_URL } from "./request";

/**
 * 处理图片 URL
 * 如果是假数据或空，返回随机酒店缩略图图；否则返回原图
 */
export const getValidThumbHotelImageUrl = (
  url?: string,
  seed?: number | string,
) => {
  if (!url || url.includes("example.com")) {
    return hotelImg[(Number(seed) ?? Math.random()) % hotelImg.length];
  }

  return url;
};

/**
 * 处理图片 URL
 * 如果是假数据或空，返回随机酒店轮播图；否则返回原图
 */
export const getValidSwiperImageUrl = (
  url?: string,
  seed?: number | string,
) => {
  if (!url || url.includes("example.com")) {
    return bannerList[(Number(seed) ?? Math.random()) % bannerList.length];
  }

  return url;
};

/**
 * 处理图片 URL
 * 如果是假数据或空，返回随机酒店详情轮播图；否则返回原图
 */
export const getValidSwiperDetailImageUrl = (
  url?: string,
  seed?: number | string,
) => {
  if (!url || url.includes("example.com")) {
    return hotelSwiper[(Number(seed) ?? Math.random()) % hotelSwiper.length];
  }

  return url;
};

/**
 * 处理图片 URL
 * 如果是假数据或空，返回随机酒店详情轮播图；否则返回原图
 */
export const getValidRoomImageUrl = (url?: string, seed?: number | string) => {
  if (!url || url.includes("example.com")) {
    return roomImage[(Number(seed) ?? Math.random()) % roomImage.length];
  }

  return url;
};

/**
 * 格式化图片 URL
 * @param url 后端返回的图片路径 (可能是相对路径，也可能是完整 http 路径)
 * @returns 完整的图片 URL
 */
export const resolveImageUrl = (url?: string) => {
  if (!url) return hotelImg[0]; // 默认图

  // 1. 如果是假数据，返回随机图
  if (url.includes("example.com")) {
    return hotelImg[0];
  }

  // 2. 如果是完整链接，直接返回
  if (url.startsWith("http")) {
    return url;
  }

  // 3. 拼接相对路径
  return `${IMG_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};
