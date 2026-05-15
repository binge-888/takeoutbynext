'use client';

import React from 'react';
import { Table, Pagination, Empty } from 'antd';
import type { TableProps } from 'antd';

interface DataTableProps<T> extends TableProps<T> {
  total: number;
  current: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  loading?: boolean;
}

export default function DataTable<T extends object>({
  total,
  current,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading,
  pagination: _pagination,
  ...tableProps
}: DataTableProps<T>) {
  return (
    <div>
      <Table
        {...tableProps}
        loading={loading}
        pagination={false}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: <Empty description="暂无数据" />,
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 16,
          padding: '16px 0',
        }}
      >
        <Pagination
          total={total}
          current={current}
          pageSize={pageSize}
          onChange={onPageChange}
          onShowSizeChange={(_, size) => onPageSizeChange?.(size)}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条`}
          pageSizeOptions={['10', '20', '50', '100']}
        />
      </div>
    </div>
  );
}
