'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Avatar, Typography, Divider } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/PageHeader';
import {
  getWorkspaceData,
  getOrderOverview,
  getDishOverview,
  getSetmealOverview,
} from '@/services';
import type { WorkspaceData, OrderOverview, DishOverview, SetmealOverview } from '@/types';
import { formatMoney } from '@/utils';

const { Title, Text } = Typography;

export default function HomePage() {
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null);
  const [orderOverview, setOrderOverview] = useState<OrderOverview | null>(null);
  const [dishOverview, setDishOverview] = useState<DishOverview | null>(null);
  const [setmealOverview, setSetmealOverview] = useState<SetmealOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [workspaceRes, orderRes, dishRes, setmealRes] = await Promise.all([
        getWorkspaceData(),
        getOrderOverview(),
        getDishOverview(),
        getSetmealOverview(),
      ]);

      if (workspaceRes.code === 1 || workspaceRes.code === 200) {
        setWorkspaceData(workspaceRes.data);
      }
      if (orderRes.code === 1 || orderRes.code === 200) {
        setOrderOverview(orderRes.data);
      }
      if (dishRes.code === 1 || dishRes.code === 200) {
        setDishOverview(dishRes.data);
      }
      if (setmealRes.code === 1 || setmealRes.code === 200) {
        setSetmealOverview(setmealRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 待处理订单数据（模拟）
  const pendingOrders = [
    { id: 1, orderNo: '202405130001', amount: 128.5, status: '待接单', time: '5分钟前' },
    { id: 2, orderNo: '202405130002', amount: 256.0, status: '待派送', time: '10分钟前' },
    { id: 3, orderNo: '202405130003', amount: 88.0, status: '待接单', time: '15分钟前' },
  ];

  return (
    <MainLayout>
      <PageHeader title="工作台" />

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="今日营业额"
              value={workspaceData?.turnover || 0}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#cf1322' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">较昨日 </Text>
              <Text type={workspaceData?.turnoverGrowthRate && workspaceData.turnoverGrowthRate >= 0 ? 'success' : 'danger'}>
                {workspaceData?.turnoverGrowthRate && workspaceData.turnoverGrowthRate >= 0 ? <RiseOutlined /> : <FallOutlined />}
                {Math.abs(workspaceData?.turnoverGrowthRate || 0).toFixed(2)}%
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="今日订单数"
              value={workspaceData?.validOrderCount || 0}
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">较昨日 </Text>
              <Text type={workspaceData?.orderGrowthRate && workspaceData.orderGrowthRate >= 0 ? 'success' : 'danger'}>
                {workspaceData?.orderGrowthRate && workspaceData.orderGrowthRate >= 0 ? <RiseOutlined /> : <FallOutlined />}
                {Math.abs(workspaceData?.orderGrowthRate || 0).toFixed(2)}%
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="今日新增用户"
              value={workspaceData?.newUsers || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">较昨日 </Text>
              <Text type={workspaceData?.newUserGrowthRate && workspaceData.newUserGrowthRate >= 0 ? 'success' : 'danger'}>
                {workspaceData?.newUserGrowthRate && workspaceData.newUserGrowthRate >= 0 ? <RiseOutlined /> : <FallOutlined />}
                {Math.abs(workspaceData?.newUserGrowthRate || 0).toFixed(2)}%
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="订单完成率"
              value={(workspaceData?.orderCompletionRate || 0) * 100}
              suffix="%"
              precision={2}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">客单价: {formatMoney(workspaceData?.unitPrice || 0)}</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 订单和菜品概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="订单概览" loading={loading}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <ClockCircleOutlined style={{ fontSize: 24, color: '#faad14', marginBottom: 8 }} />
                  <div style={{ fontSize: 24, fontWeight: 'bold' }}>{orderOverview?.waitingOrders || 0}</div>
                  <div style={{ color: '#999' }}>待接单</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <CarOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
                  <div style={{ fontSize: 24, fontWeight: 'bold' }}>{orderOverview?.deliveredOrders || 0}</div>
                  <div style={{ color: '#999' }}>待派送</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
                  <div style={{ fontSize: 24, fontWeight: 'bold' }}>{orderOverview?.completedOrders || 0}</div>
                  <div style={{ color: '#999' }}>已完成</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <InboxOutlined style={{ fontSize: 24, color: '#ff4d4f', marginBottom: 8 }} />
                  <div style={{ fontSize: 24, fontWeight: 'bold' }}>{orderOverview?.cancelledOrders || 0}</div>
                  <div style={{ color: '#999' }}>已取消</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="商品概览" loading={loading}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold' }}>{dishOverview?.sold || 0}</div>
                  <div style={{ color: '#999' }}>已启售菜品</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold' }}>{dishOverview?.discontinued || 0}</div>
                  <div style={{ color: '#999' }}>已停售菜品</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold' }}>{setmealOverview?.sold || 0}</div>
                  <div style={{ color: '#999' }}>已启售套餐</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold' }}>{setmealOverview?.discontinued || 0}</div>
                  <div style={{ color: '#999' }}>已停售套餐</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 待处理订单 */}
      <Card title="待处理订单" extra={<a href="/order">查看全部</a>}>
        <List
          itemLayout="horizontal"
          dataSource={pendingOrders}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Tag color={item.status === '待接单' ? 'warning' : 'processing'} key="status">
                  {item.status}
                </Tag>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<ShoppingCartOutlined />} style={{ backgroundColor: '#ff4d4f' }} />}
                title={<Text strong>订单号: {item.orderNo}</Text>}
                description={item.time}
              />
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#cf1322' }}>
                {formatMoney(item.amount)}
              </div>
            </List.Item>
          )}
        />
      </Card>
    </MainLayout>
  );
}
