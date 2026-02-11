export const useCurrency = () => {
  /**
   * 格式化金额
   * @param amount 金额
   * @returns 格式化后的金额（保留两位小数）
   */
  const formatAmount = (amount: number) => {
    return amount?.toFixed(2) ?? "0.00";
  };
  return {
    formatAmount,
  };
};
