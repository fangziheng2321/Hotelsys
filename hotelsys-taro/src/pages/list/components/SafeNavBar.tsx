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
import { ConfigProvider, harmony, NavBar } from "@nutui/nutui-react-taro";
import { ArrowLeft } from "@nutui/icons-react-taro";
import Taro from "@tarojs/taro";

interface IProps {}

const SafeNavBar: FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [safeHeight, setSafeHeight] = useState<number>(0);
  const [capsuleHeight, setCapsuleHeight] = useState<number>(0);
  const customNavTheme = useMemo(() => {
    return {
      nutuiNavbarHeight: `${capsuleHeight}px`,
    };
  }, [capsuleHeight]);

  useEffect(() => {
    const getWeixinMenuButtonBoundingClientRect = () => {
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        return Taro.getMenuButtonBoundingClientRect();
      }
      return null;
    };

    const menuInfo = getWeixinMenuButtonBoundingClientRect();
    if (menuInfo) {
      setSafeHeight(menuInfo.top);
      setCapsuleHeight(menuInfo.height);
    }
  }, [safeHeight]);

  return (
    <View style={{ paddingTop: `${safeHeight}px` }}>
      <ConfigProvider theme={customNavTheme}>
        <NavBar
          title={t("list.recommend")}
          back={<ArrowLeft />}
          onBackClick={() => Taro.navigateBack()}
        />
      </ConfigProvider>
    </View>
  );
};

export default SafeNavBar;
