import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { View, Text } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { DetailInfoType } from "../types";
import StarRate from "@/components/StarRate/StarRate";
import Facility from "./Facility";
import Address from "./Address";
import HotelComment from "./Comment";

interface IProps extends DetailInfoType {}

const DetailInfo: FC<IProps> = ({
  id,
  name,
  rate,
  facilities,
  description,
  address,
}) => {
  const { t } = useTranslation();
  const [commentExpanded, setCommentExpanded] = useState(false);
  const [commentClamp, setCommentClamp] = useState(true);
  const [commentAutoHeight, setCommentAutoHeight] = useState(false);

  // 这里需要给自动高度做一个延时，避免动画过程中被多个文本撑的过高
  useEffect(() => {
    if (commentExpanded) {
      const timer = setTimeout(() => {
        setCommentClamp(false);
        setCommentAutoHeight(true);
      }, 260);
      return () => clearTimeout(timer);
    }
    setCommentClamp(true);
    setCommentAutoHeight(false);
  }, [commentExpanded]);

  return (
    <View
      className="relative flex flex-col gap-6"
      onClick={() => setCommentExpanded(false)}
    >
      {/* 口碑推荐 */}
      {rate >= 4 && (
        <View className="absolute right-4 -top-12 w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-50 rounded-lg shadow-sm flex flex-col items-center justify-center border border-orange-200">
          <Text className="text-sm text-orange-800 font-bold">
            {t("detail.info.wordOfMouth")}
          </Text>
          <Text className="text-sm text-orange-800 font-bold">
            {t("detail.info.referral")}
          </Text>
        </View>
      )}

      {/* 酒店基础信息 */}
      <View className="flex flex-col gap-2 mt-6">
        {/* 名字 */}
        <Text className="text-xl font-bold text-gray-900 dark:text-dark-text leading-tight line-clamp-2">
          {name ?? "N/A"}
        </Text>
        {/* 星级 */}
        <StarRate rate={rate} />
      </View>

      {/* 酒店设施 */}
      <Facility facilities={facilities} />

      {/* 评价与地址 */}
      <View
        className={[
          "flex justify-between items-center gap-2 transition-all duration-300",
          commentAutoHeight ? "h-auto" : "h-16",
        ].join(" ")}
      >
        <View
          className={[
            "h-full transition-all duration-300 overflow-hidden",
            commentExpanded ? "flex-1" : "w-1/2",
          ].join(" ")}
          onClick={(e) => {
            e.stopPropagation();
            setCommentExpanded((prev) => !prev);
          }}
        >
          <HotelComment description={description} expanded={!commentClamp} />
        </View>
        <View
          className={[
            "transition-all duration-300 overflow-hidden h-full",
            commentExpanded
              ? "w-0 opacity-0 pointer-events-none"
              : "flex-1 opacity-100",
          ].join(" ")}
        >
          <Address address={address} hotelId={id} />
        </View>
      </View>
    </View>
  );
};

export default DetailInfo;
