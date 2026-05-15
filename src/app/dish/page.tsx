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
  Image,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/PageHeader';
import SearchForm from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import ImageUpload from '@/components/ImageUpload';
import { getDishPage, addDish, updateDish, deleteDish, toggleDishStatus, getCategoryList } from '@/services';
import { useTable } from '@/hooks';
import type { Dish, Category } from '@/types';
import { formatMoney } from '@/utils';
import { getImageUrl } from '@/services';

const { Option } = Select;
const { TextArea } = Input;

function DishPage() {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Dish | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = useCallback(async (params: { page: number; pageSize: number }) => {
    const values = form.getFieldsValue();
    const res = await getDishPage({
      ...params,
      ...values,
    });
    return res.data;
  }, [form]);

  const { data, loading, total, page, pageSize, handlePageChange, handlePageSizeChange, refresh } =
    useTable<Dish>({
      fetchData,
    });

  // 加载分类列表
  const loadCategories = async () => {
    try {
      const res = await getCategoryList({ type: 1 });
      if (res.code === 1 || res.code === 200) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

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
    loadCategories();
    setModalVisible(true);
  };

  // 打开编辑弹窗
  const handleEdit = (record: Dish) => {
    setEditingRecord(record);
    modalForm.setFieldsValue(record);
    loadCategories();
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await modalForm.validateFields();
      setSubmitLoading(true);

      if (editingRecord) {
        const res = await updateDish({ ...editingRecord, ...values });
        if (res.code === 1 || res.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          refresh();
        } else {
          message.error(res.msg || '修改失败');
        }
      } else {
        const res = await addDish(values);
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
      const res = await deleteDish([id]);
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
  const handleToggleStatus = async (record: Dish) => {
    try {
      const newStatus = record.status === 1 ? 0 : 1;
      const res = await toggleDishStatus({ id: record.id!, status: newStatus });
      if (res.code === 1 || res.code === 200) {
        message.success(newStatus === 1 ? '已启售' : '已停售');
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
      title: '菜品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image: string) =>
        image ? (
          <Image src={getImageUrl(image)} alt="菜品图片" width={60} height={60} style={{ objectFit: 'cover' }} />
        ) : (
          <span style={{ color: '#999' }}>暂无图片</span>
        ),
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text: string) => text || '-',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatMoney(price),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number, record: Dish) => (
        <Switch
          checked={status === 1}
          onChange={() => handleToggleStatus(record)}
          checkedChildren="启售"
          unCheckedChildren="停售"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: Dish) => (
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
        title="菜品管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增菜品
          </Button>
        }
      />

      <SearchForm form={form} onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <Form.Item name="name" label="菜品名称" style={{ marginBottom: 0 }}>
          <Input placeholder="请输入菜品名称" allowClear style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="categoryId" label="分类" style={{ marginBottom: 0 }}>
          <Select placeholder="请选择" allowClear style={{ width: 150 }}>
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态" style={{ marginBottom: 0 }}>
          <Select placeholder="请选择" allowClear style={{ width: 120 }}>
            <Option value={1}>启售</Option>
            <Option value={0}>停售</Option>
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
        title={editingRecord ? '编辑菜品' : '新增菜品'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={submitLoading}
        destroyOnClose
        width={600}
      >
        <Form form={modalForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="菜品名称"
            rules={[{ required: true, message: '请输入菜品名称' }]}
          >
            <Input placeholder="请输入菜品名称" />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="所属分类"
            rules={[{ required: true, message: '请选择所属分类' }]}
          >
            <Select placeholder="请选择所属分类">
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              placeholder="请输入价格"
              prefix="¥"
            />
          </Form.Item>
          <Form.Item name="image" label="菜品图片">
            <ImageUpload />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={3} placeholder="请输入菜品描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select>
              <Option value={1}>启售</Option>
              <Option value={0}>停售</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
}

export default function DishPageWrapper() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <DishPage />
    </Suspense>
  );
}
