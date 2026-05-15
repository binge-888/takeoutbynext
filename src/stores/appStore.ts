import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  // 侧边栏折叠状态
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;

  // 主题配置
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  // 当前选中的菜单
  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;

  // 打开的菜单
  openKeys: string[];
  setOpenKeys: (keys: string[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
      setCollapsed: (collapsed: boolean) => set({ collapsed }),

      theme: 'light',
      setTheme: (theme: 'light' | 'dark') => set({ theme }),

      selectedKeys: [],
      setSelectedKeys: (keys: string[]) => set({ selectedKeys: keys }),

      openKeys: [],
      setOpenKeys: (keys: string[]) => set({ openKeys: keys }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
