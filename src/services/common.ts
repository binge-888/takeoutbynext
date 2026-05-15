import { post, get } from '@/utils/request';
import type { ApiResponse } from '@/types';

// 文件上传
export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return post<ApiResponse<string>>('/common/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 获取图片预览URL
export const getImageUrl = (imageName: string) => {
  return `/common/download?name=${encodeURIComponent(imageName)}`;
};
