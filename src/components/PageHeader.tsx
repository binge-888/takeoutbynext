'use client';

import React from 'react';
import { Space, Typography, Breadcrumb } from 'antd';
import Link from 'next/link';

const { Title } = Typography;

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  extra?: React.ReactNode;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  breadcrumbs,
  extra,
  children,
}: PageHeaderProps) {
  const breadcrumbItems = breadcrumbs?.map((item, index) => ({
    key: index,
    title: item.href ? <Link href={item.href}>{item.title}</Link> : item.title,
  }));

  return (
    <div style={{ marginBottom: 24 }}>
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
        {extra && <Space>{extra}</Space>}
      </div>
      {children}
    </div>
  );
}
