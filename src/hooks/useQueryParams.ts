'use client';

import { useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export const useQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 获取查询参数
  const getParam = useCallback(
    (key: string, defaultValue?: string) => {
      return searchParams?.get(key) || defaultValue;
    },
    [searchParams]
  );

  // 设置查询参数
  const setParams = useCallback(
    (params: Record<string, string | number | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString() || '');

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // 删除查询参数
  const removeParam = useCallback(
    (key: string) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString() || '');
      newSearchParams.delete(key);
      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // 重置所有查询参数
  const resetParams = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return {
    searchParams,
    getParam,
    setParams,
    removeParam,
    resetParams,
  };
};
