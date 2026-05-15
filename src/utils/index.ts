import dayjs from 'dayjs';

// 格式化日期
export const formatDate = (date: string | Date | number, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '-';
  return dayjs(date).format(format);
};

// 格式化日期（仅日期）
export const formatDateOnly = (date: string | Date | number) => {
  return formatDate(date, 'YYYY-MM-DD');
};

// 格式化金额
export const formatMoney = (amount: number | string) => {
  if (amount === undefined || amount === null) return '¥0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `¥${num.toFixed(2)}`;
};

// 格式化数字
export const formatNumber = (num: number | string, decimals = 0) => {
  if (num === undefined || num === null) return '0';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  return n.toFixed(decimals);
};

// 防抖函数
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

// 节流函数
export const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn(...args);
      lastTime = now;
    }
  };
};

// 深拷贝
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const cloned: Record<string, unknown> = {};
    Object.keys(obj).forEach((key) => {
      cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
    });
    return cloned as T;
  }
  return obj;
};

// 生成唯一ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// 下载文件
export const downloadFile = (url: string, filename?: string) => {
  const link = document.createElement('a');
  link.href = url;
  if (filename) {
    link.download = filename;
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 将 Base64 转换为 Blob
export const base64ToBlob = (base64: string, contentType = '') => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512);
    const byteNumbers = new Array(slice.length);
    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

// 获取时间段
export const getDateRange = (type: 'today' | 'yesterday' | 'week' | 'month' | 'year') => {
  const now = dayjs();
  let start: dayjs.Dayjs;
  let end: dayjs.Dayjs = now;

  switch (type) {
    case 'today':
      start = now.startOf('day');
      end = now.endOf('day');
      break;
    case 'yesterday':
      start = now.subtract(1, 'day').startOf('day');
      end = now.subtract(1, 'day').endOf('day');
      break;
    case 'week':
      start = now.startOf('week');
      end = now.endOf('week');
      break;
    case 'month':
      start = now.startOf('month');
      end = now.endOf('month');
      break;
    case 'year':
      start = now.startOf('year');
      end = now.endOf('year');
      break;
    default:
      start = now.startOf('day');
  }

  return {
    startTime: start.format('YYYY-MM-DD HH:mm:ss'),
    endTime: end.format('YYYY-MM-DD HH:mm:ss'),
  };
};
