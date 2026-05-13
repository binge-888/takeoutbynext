'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores';
import { login, getUserInfo } from '@/services';

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setUserInfo } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      // 调用登录接口
      const res = await login(values);

      if (res.code === 1 || res.code === 200) {
        const { token, id, userName, name } = res.data;

        // 保存 token
        setToken(token);

        // 获取用户信息
        try {
          const userRes = await getUserInfo();
          if (userRes.code === 1 || userRes.code === 200) {
            setUserInfo(userRes.data);
          }
        } catch (error) {
          console.error('Failed to get user info:', error);
        }

        message.success('登录成功');
        router.push('/');
      } else {
        message.error(res.msg || '登录失败');
      }
    } catch (error) {
      console.error('Login failed:', error);
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 200,
      }}
    >
      <Card
        style={{
          width: 420,
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
        bodyStyle={{ padding: '48px 40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Title level={2} style={{ marginBottom: 8, color: '#ff4d4f' }}>
            苍穹外卖
          </Title>
          <Text type="secondary">商家后台管理系统</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                background: '#ff4d4f',
                borderColor: '#ff4d4f',
                height: 48,
                fontSize: 16,
              }}
            >
              登 录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              默认账号: admin / 密码: 123456
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}
