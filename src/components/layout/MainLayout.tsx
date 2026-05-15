'use client';

import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Badge,
  Space,
  Typography,
  theme,
  Row,
  Col,
  Spin,
} from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
  BellOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore, useAppStore } from '@/stores';
import { useAuth } from '@/hooks';
import { logout } from '@/services';
import { message } from 'antd';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '工作台',
    path: '/',
  },
  {
    key: '/category',
    icon: <AppstoreOutlined />,
    label: '分类管理',
    path: '/category',
  },
  {
    key: '/dish',
    icon: <ShoppingOutlined />,
    label: '菜品管理',
    path: '/dish',
  },
  {
    key: '/setmeal',
    icon: <UnorderedListOutlined />,
    label: '套餐管理',
    path: '/setmeal',
  },
  {
    key: '/order',
    icon: <ShoppingCartOutlined />,
    label: '订单管理',
    path: '/order',
  },
  {
    key: '/report',
    icon: <BarChartOutlined />,
    label: '数据统计',
    path: '/report',
  },
  {
    key: '/employee',
    icon: <TeamOutlined />,
    label: '员工管理',
    path: '/employee',
  },
  {
    key: '/setting',
    icon: <SettingOutlined />,
    label: '系统设置',
    path: '/setting',
  },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token } = theme.useToken();
  const { userInfo, clearUserInfo } = useUserStore();
  const { collapsed, toggleCollapsed, openKeys, setOpenKeys, selectedKeys, setSelectedKeys } =
    useAppStore();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  // 设置当前选中的菜单
  useEffect(() => {
    if (pathname) {
      const currentMenu = menuItems.find(
        (item) => item.path === pathname || pathname.startsWith(item.path + '/')
      );
      if (currentMenu) {
        setSelectedKeys([currentMenu.key]);
      }
    }
    // 模拟加载
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname, setSelectedKeys]);

  // 处理退出登录
  const handleLogout = async () => {
    try {
      await logout();
      clearUserInfo();
      message.success('退出登录成功');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'password',
      icon: <LockOutlined />,
      label: '修改密码',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  // 渲染菜单项
  const renderMenuItems = (items: MenuItem[]): any[] => {
    return items.map((item) => {
      if (item.children && item.children.length > 0) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: renderMenuItems(item.children),
        };
      }
      return {
        key: item.key,
        icon: item.icon,
        label: <Link href={item.path}>{item.label}</Link>,
      };
    });
  };

  // 处理菜单展开
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Spin spinning={loading} size="large" tip="加载中...">
      <Layout style={{ minHeight: '100vh' }}>
        {/* 侧边栏 */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="light"
          width={200}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
          }}
        >
          {/* Logo */}
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            {collapsed ? (
              <span style={{ fontSize: 24, fontWeight: 'bold', color: token.colorPrimary }}>
                苍
              </span>
            ) : (
              <span style={{ fontSize: 18, fontWeight: 'bold', color: token.colorPrimary }}>
                苍穹外卖
              </span>
            )}
          </div>

          {/* 菜单 */}
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            items={renderMenuItems(menuItems)}
            style={{ borderRight: 0 }}
          />
        </Sider>

        <Layout
          style={{
            marginLeft: collapsed ? 80 : 200,
            transition: 'all 0.2s',
          }}
        >
          {/* 顶部导航 */}
          <Header
            style={{
              background: '#fff',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              position: 'sticky',
              top: 0,
              zIndex: 99,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: 18,
                  cursor: 'pointer',
                  marginRight: 24,
                }}
                onClick={toggleCollapsed}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </div>
              <Text type="secondary">
                欢迎回来，{userInfo?.name || '管理员'}
              </Text>
            </div>

            <Space size={24}>
              {/* 通知 */}
              <Badge count={5} size="small">
                <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
              </Badge>

              {/* 用户头像 */}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar
                    size="small"
                    src={userInfo?.avatar}
                    icon={<UserOutlined />}
                  />
                  <Text>{userInfo?.name || '管理员'}</Text>
                  <DownOutlined style={{ fontSize: 12 }} />
                </Space>
              </Dropdown>
            </Space>
          </Header>

          {/* 内容区域 */}
          <Content
            style={{
              margin: 24,
              padding: 24,
              background: '#fff',
              borderRadius: 8,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Spin>
  );
}
