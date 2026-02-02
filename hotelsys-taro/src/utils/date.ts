import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import { useTranslation } from "react-i18next";

dayjs.extend(calendar);

export const useTime = () => {
  const { t, i18n } = useTranslation();
  // 强制设置 locale，防止全局 locale 切换延迟导致的问题
  const currentLocale = i18n.language.startsWith("en") ? "en" : "zh-cn";

  /**
   * 获取日期的标签
   * @param dateStr 日期
   * @returns 日期的标签（“今天”|“明天”|“周一”...）
   */
  const getDayLabel = (dateStr: string | Date | dayjs.Dayjs): string => {
    const target = dayjs(dateStr);
    const today = dayjs();

    const sameElseFormat =
      target.year() === today.year() ? "MM-DD" : "YYYY-MM-DD";

    // 使用 calendar 插件来处理今天/明天/后天的逻辑
    // 注意：dayjs 的 calendar 默认配置可能不完全符合中文习惯，这里自定义配置
    return target.calendar(today, {
      sameDay: `[${t("time.sameDay")}]`, // 今天
      nextDay: `[${t("time.nextDay")}]`, // 明天
      nextWeek: "dddd", // 下周显示星期几
      lastDay: `[${t("time.yesterday")}]`, // 昨天
      lastWeek: "dddd", // 上周显示星期几
      sameElse: sameElseFormat, // 其他情况显示日期
    });
  };

  /**
   * 格式化日期
   * @param date 日期
   * @param format 格式字符串，不传则根据语言环境自动选择（中文：M月D日，英文：MMM D）
   */
  const formatDate = (date: string | Date | dayjs.Dayjs, format?: string) => {
    const d = dayjs(date).locale(currentLocale);
    if (format) {
      return d.format(format);
    }
    const defaultFormat = currentLocale === "zh-cn" ? "M月D日" : "MMM D";
    return d.format(defaultFormat);
  };

  /**
   * 计算两个日期之间的天数差（通常用于计算入住晚数）
   * @param startDate 开始日期
   * @param endDate 结束日期
   */
  const getDuration = (
    startDate: string | Date | dayjs.Dayjs,
    endDate: string | Date | dayjs.Dayjs,
  ) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    return end.diff(start, "day");
  };

  return {
    dayjs,
    getDayLabel,
    formatDate,
    getDuration,
  };
};
