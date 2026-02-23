/**
 * 手动插值替换工具
 * @param template 翻译模版字符串，例如: "{count}张{size}米床"
 * @param params 参数对象，例如: { count: 2, size: 1.5 }
 * @returns 替换后的字符串
 */
export const formatStr = (
  template: string,
  params: Record<string, string | number>,
): string => {
  if (!template) return "";
  if (!params) return template;

  let result = template;

  // 遍历参数对象，把模版里的 {key} 替换成 value
  Object.keys(params).forEach((key) => {
    // 使用正则全局替换，确保如果出现两次 {val} 都能被替换
    // 注意：这里用 \\{ 和 \\} 来匹配字面量的花括号
    const reg = new RegExp(`\\{${key}\\}`, "g");
    result = result.replace(reg, String(params[key]));
  });

  return result;
};
