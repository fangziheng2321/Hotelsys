import { useState, useEffect } from "react";

/**
 * @param value 需要防抖的值
 * @param delay 延迟时间 (ms)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设定一个定时器，在 delay 时间后更新 debouncedValue
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 如果 value 在 delay 时间内又变了，清除上一次的定时器
    // 这就是防抖的核心
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
