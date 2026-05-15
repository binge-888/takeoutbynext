'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/stores';

// 不需要登录的白名单路径
const whiteList = ['/login', '/404'];

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, userInfo, isLoggedIn } = useUserStore();

  useEffect(() => {
    // 检查是否需要登录
    const isWhiteList = whiteList.some((path) => pathname?.startsWith(path));

    if (!isLoggedIn() && !isWhiteList) {
      router.push('/login');
    }
  }, [pathname, router, isLoggedIn]);

  return {
    token,
    userInfo,
    isLoggedIn: isLoggedIn(),
  };
};
