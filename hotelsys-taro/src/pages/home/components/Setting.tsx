import React, { FC, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { useTranslation } from "react-i18next";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import { Avatar, Radio } from "@nutui/nutui-react-taro";
import { Setting as SettingIcon } from "@nutui/icons-react-taro";
import CustomPopup from "@/components/CustomPopup/CustomPopup";
import { remToPx, setStatusBarStyle } from "@/utils/style";
import { useThemeStore } from "@/store/themeStore";
import Taro from "@tarojs/taro";
import Divide from "./Divide";
import { Theme } from "@/enum/theme";

interface IProps {}

const Setting: FC<IProps> = (props) => {
  const { t, i18n } = useTranslation();
  const { currentTheme, isDark, setTheme } = useThemeStore();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const openSettingPopup = () => {
    // 修改系统状态栏为黑色
    if (!isDark) {
      setStatusBarStyle("black");
    }
    setIsVisible(true);
  };

  const closeSettingPopup = () => {
    // 修改系统状态栏为白色
    setStatusBarStyle("white");
    setIsVisible(false);
  };

  // 切换语言
  const handleLanguageChange = (value: "en" | "zh") => {
    i18n.changeLanguage(value);
    Taro.setStorageSync("locale", value);
  };

  // 切换主题
  const handleThemeChange = (value: Theme) => {
    setTheme(value);
  };

  return (
    <View>
      <SettingIcon color="#fff" onClick={openSettingPopup} />
      <PageWrapper>
        <CustomPopup
          position="left"
          customClassName="w-fit"
          isVisible={isVisible}
          onClose={closeSettingPopup}
        >
          {/* 系统控制设置 */}
          <View className="px-4 py-4 mt-10 flex flex-col gap-4">
            {/* 标题 */}
            <View className="flex gap-3 items-center mb-4">
              <Avatar size={`${remToPx(3)}`} />
              <Text className="text-base font-bold">
                {t("home.setting.welcome")}
              </Text>
            </View>
            <View className="flex gap-2 items-center">
              <Text className="text-base font-bold">
                {t("home.setting.systemSetting")}
              </Text>
              <SettingIcon />
            </View>
            {/* 分隔线 */}
            <Divide />
            {/* 语言设置 */}
            <View className="flex flex-col gap-3">
              <Text className="text-sm font-bold">
                - {t("home.setting.language")}
              </Text>
              <Radio.Group
                className="flex gap-2"
                value={i18n.language}
                direction="horizontal"
                onChange={(value: "en" | "zh") => handleLanguageChange(value)}
              >
                <Radio value="zh">中文</Radio>
                <Radio value="en">English</Radio>
              </Radio.Group>
            </View>

            {/* 主题设置 */}
            <View className="flex flex-col gap-3">
              <Text className="text-sm font-bold">
                - {t("home.setting.darkMode")}
              </Text>
              <Radio.Group
                className="flex gap-2"
                onChange={(value: Theme) => handleThemeChange(value)}
                value={currentTheme}
                shape="button"
                direction="horizontal"
              >
                <Radio value={Theme.LIGHT}>
                  {t("home.setting.theme.light")}
                </Radio>
                <Radio value={Theme.DARK}>{t("home.setting.theme.dark")}</Radio>
                <Radio value={Theme.AUTO}>{t("home.setting.theme.auto")}</Radio>
              </Radio.Group>
            </View>
          </View>
        </CustomPopup>
      </PageWrapper>
    </View>
  );
};

export default Setting;
