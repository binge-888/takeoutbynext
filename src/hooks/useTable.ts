'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQueryParams } from './useQueryParams';

interface UseTableOptions<T> {
  defaultPage?: number;
  defaultPageSize?: number;
  fetchData: (params: { page: number; pageSize: number }) => Promise<{
    total: number;
    records: T[];
  }>;
}

export const useTable = <T,>(options: UseTableOptions<T>) => {
  const { defaultPage = 1, defaultPageSize = 10, fetchData } = options;
  const { getParam, setParams } = useQueryParams();

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(() => Number(getParam('page')) || defaultPage);
  const [pageSize, setPageSize] = useState(() => Number(getParam('pageSize')) || defaultPageSize);

  // 加载数据
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchData({ page, pageSize });
      setData(res.records);
      setTotal(res.total);
    } catch (error) {
      console.error('Failed to fetch table data:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, fetchData]);

  // 页码变化
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      setParams({ page: String(newPage) });
    },
    [setParams]
  );

  // 每页条数变化
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      setPage(1);
      setParams({ page: '1', pageSize: String(newPageSize) });
    },
    [setParams]
  );

  // 刷新数据
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    handlePageChange,
    handlePageSizeChange,
    refresh,
  };
};
