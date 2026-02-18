import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { View, Text, Image } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "@nutui/icons-react-taro";
import { hotelInfo } from "@/constant/detail";

interface IProps {
  description: string;
}

const Comment: FC<IProps> = ({ description }) => {
  const { t } = useTranslation();

  return (
    <View className="w-1/2 bg-sky-50/50 p-3 rounded-2xl border border-sky-100/50 h-full flex justify-between gap-2">
      {/* 描述图标 */}
      <View className="bg-blue-200/50 rounded-lg w-8 h-8 p-2 flex items-center justify-center">
        <Image src={hotelInfo.description} className="size-full" />
      </View>
      <View className="text-xs text-blue-800/70 line-clamp-3 max-h-[3rem] break-all flex-1">
        {description ?? "N/A"}
      </View>
    </View>
  );
};

export default Comment;
