'use client';

import React, { Suspense, useState, useCallback } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Modal,
  Popconfirm,
  Space,
  Switch,
  InputNumber,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/PageHeader';
import SearchForm from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import StatusTag from '@/components/StatusTag';
import {
  getCategoryPage,
  addCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from '@/services';
import { useTable } from '@/hooks';
import type { Category } from '@/types';

const { Option } = Select;

function CategoryPage() {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Category | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchData = useCallback(async (params: { page: number; pageSize: number }) => {
    const values = form.getFieldsValue();
    const res = await getCategoryPage({
      ...params,
      ...values,
    });
    return res.data;
  }, [form]);

  const { data, loading, total, page, pageSize, handlePageChange, handlePageSizeChange, refresh } =
    useTable<Category>({
      fetchData,
    });

  // 搜索
  const handleSearch = () => {
    handlePageChange(1);
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    handlePageChange(1);
  };

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingRecord(null);
    modalForm.resetFields();
    setModalVisible(true);
  };

  // 打开编辑弹窗
  const handleEdit = (record: Category) => {
    setEditingRecord(record);
    modalForm.setFieldsValue(record);
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await modalForm.validateFields();
      setSubmitLoading(true);

      if (editingRecord) {
        // 编辑
        const res = await updateCategory({ ...editingRecord, ...values });
        if (res.code === 1 || res.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          refresh();
        } else {
          message.error(res.msg || '修改失败');
        }
      } else {
        // 新增
        const res = await addCategory(values);
        if (res.code === 1 || res.code === 200) {
          message.success('添加成功');
          setModalVisible(false);
          refresh();
        } else {
          message.error(res.msg || '添加失败');
        }
      }
    } catch (error) {
      console.error('Submit failed:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  // 删除
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteCategory(id);
      if (res.code === 1 || res.code === 200) {
        message.success('删除成功');
        refresh();
      } else {
        message.error(res.msg || '删除失败');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // 切换状态
  const handleToggleStatus = async (record: Category) => {
    try {
      const newStatus = record.status === 1 ? 0 : 1;
      const res = await toggleCategoryStatus({ id: record.id!, status: newStatus });
      if (res.code === 1 || res.code === 200) {
        message.success(newStatus === 1 ? '已启用' : '已禁用');
        refresh();
      } else {
        message.error(res.msg || '操作失败');
      }
    } catch (error) {
      console.error('Toggle status failed:', error);
    }
  };

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => (type === 1 ? '菜品分类' : '套餐分类'),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number, record: Category) => (
        <Switch
          checked={status === 1}
          onChange={() => handleToggleStatus(record)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: Category) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="分类管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增分类
          </Button>
        }
      />

      <SearchForm form={form} onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <Form.Item name="name" label="分类名称" style={{ marginBottom: 0 }}>
          <Input placeholder="请输入分类名称" allowClear style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="type" label="分类类型" style={{ marginBottom: 0 }}>
          <Select placeholder="请选择" allowClear style={{ width: 150 }}>
            <Option value={1}>菜品分类</Option>
            <Option value={2}>套餐分类</Option>
          </Select>
        </Form.Item>
      </SearchForm>

      <DataTable
        columns={columns}
        dataSource={data}
        loading={loading}
        total={total}
        current={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <Modal
        title={editingRecord ? '编辑分类' : '新增分类'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={submitLoading}
        destroyOnClose
      >
        <Form form={modalForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="分类类型"
            rules={[{ required: true, message: '请选择分类类型' }]}
          >
            <Select placeholder="请选择分类类型">
              <Option value={1}>菜品分类</Option>
              <Option value={2}>套餐分类</Option>
            </Select>
          </Form.Item>
          <Form.Item name="sort" label="排序" initialValue={0}>
            <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入排序值，数字越小越靠前" />
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
}

export default function CategoryPageWrapper() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <CategoryPage />
    </Suspense>
  );
}
