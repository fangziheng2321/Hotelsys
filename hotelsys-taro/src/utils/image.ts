import { hotelSwiper, roomImage } from "@/constant/detail";
import { bannerList } from "@/constant/home";
import { hotelImg } from "@/constant/list";

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
