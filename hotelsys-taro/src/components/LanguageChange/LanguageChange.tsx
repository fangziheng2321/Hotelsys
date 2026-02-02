import React, { FC } from "react";
import { Button } from "@nutui/nutui-react-taro";
import { useTranslation } from "react-i18next";
import Taro, { getCurrentPages } from "@tarojs/taro";
import { View } from "@tarojs/components";

interface IProps {
  customClassName: string;
}

const LanguageChange: FC<IProps> = (props) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = () => {
    const newLang = i18n.language === "en" ? "zh" : "en";

    // 这会自动触发所有使用了 useTranslation 的组件重新渲染
    i18n.changeLanguage(newLang);

    // 持久化保存（为了下次冷启动时记得住）
    Taro.setStorageSync("locale", newLang);
  };

  return (
    <View className={props.customClassName}>
      <Button type="primary" onClick={handleLanguageChange}>
        {t("language.languageChange")}
      </Button>
    </View>
  );
};

export default LanguageChange;
