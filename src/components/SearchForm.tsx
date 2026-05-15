'use client';

import React from 'react';
import { Form, Row, Col, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface SearchFormProps {
  children: React.ReactNode;
  onSearch: (values: Record<string, unknown>) => void;
  onReset?: () => void;
  loading?: boolean;
  form?: any;
}

export default function SearchForm({
  children,
  onSearch,
  onReset,
  loading,
  form: formProp,
}: SearchFormProps) {
  const [innerForm] = Form.useForm();
  const form = formProp || innerForm;

  const handleReset = () => {
    form.resetFields();
    onReset?.();
  };

  return (
    <Form
      form={form}
      onFinish={onSearch}
      style={{ marginBottom: 24, padding: 24, background: '#fafafa', borderRadius: 8 }}
    >
      <Row gutter={24} align="middle">
        <Col flex="auto">
          <Row gutter={24}>{children}</Row>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={loading}
            >
              查询
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
}
