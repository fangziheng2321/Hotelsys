import { useState, useCallback } from 'react';

export function useAsyncAction<T extends (...args: any[]) => Promise<any>>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(async (action: T, ...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    // 防止重复执行
    if (loading) return null;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await action(...args);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('操作失败'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    execute,
    loading,
    error,
    success,
    reset
  };
}
