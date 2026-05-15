'use client';

import React from 'react';
import { Tag } from 'antd';

interface StatusTagProps {
  status: number | boolean;
  type?: 'switch' | 'process' | 'order';
}

const statusMap: Record<string, Record<number | string, { color: string; text: string }>> = {
  switch: {
    1: { color: 'success', text: '启用' },
    0: { color: 'default', text: '禁用' },
  },
  process: {
    0: { color: 'warning', text: '待审核' },
    1: { color: 'processing', text: '进行中' },
    2: { color: 'success', text: '已完成' },
    3: { color: 'error', text: '已取消' },
  },
  order: {
    1: { color: 'warning', text: '待付款' },
    2: { color: 'processing', text: '待接单' },
    3: { color: 'processing', text: '已接单' },
    4: { color: 'processing', text: '派送中' },
    5: { color: 'success', text: '已完成' },
    6: { color: 'error', text: '已取消' },
  },
};

export default function StatusTag({ status, type = 'switch' }: StatusTagProps) {
  const map = statusMap[type];
  const normalizedStatus = typeof status === 'boolean' ? (status ? 1 : 0) : status;
  const config = map[normalizedStatus] || { color: 'default', text: '未知' };

  return <Tag color={config.color}>{config.text}</Tag>;
}
