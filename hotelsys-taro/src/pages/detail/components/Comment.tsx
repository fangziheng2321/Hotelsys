import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import { View, Text, Span } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "@nutui/icons-react-taro";

interface IProps {
  score: number;
}

const Comment: FC<IProps> = ({ score }) => {
  const { t } = useTranslation();

  return (
    <View className="w-1/2 bg-sky-50/50 p-3 rounded-2xl border border-sky-100/50 h-full flex-col flex justify-between">
      <View className="flex items-baseline justify-between gap-1 text-blue-600">
        <Span className="text-lg font-bold">{(score ?? 0).toFixed(1)}</Span>
        {score && score > 4.7 && (
          <Span className="text-sm font-semibold">超棒</Span>
        )}
        <Span className="text-xs text-blue-400 ml-auto">
          5495条评论 <ArrowRight size="0.75rem" color="#60a5fa" />
        </Span>
      </View>
      <Text className="text-xs text-blue-800/70 truncate w-full min-w-0">
        “中式风格装修，舒适安逸”
      </Text>
    </View>
  );
};

export default Comment;
