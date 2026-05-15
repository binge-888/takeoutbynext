'use client';

import React, { useState } from 'react';
import { Upload, message, Image } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { uploadFile, getImageUrl } from '@/services';

interface ImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  maxSize?: number; // 单位：MB
}

export default function ImageUpload({
  value,
  onChange,
  maxSize = 2,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps['onChange'] = ({ file }) => {
    if (file.status === 'uploading') {
      setLoading(true);
    }
  };

  const customRequest: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      setLoading(true);
      const res = await uploadFile(file as File);
      if (res.code === 1 || res.code === 200) {
        onChange?.(res.data);
        onSuccess?.(res.data);
        message.success('上传成功');
      } else {
        onError?.(new Error(res.msg));
        message.error(res.msg || '上传失败');
      }
    } catch (error) {
      onError?.(error as Error);
      message.error('上传失败');
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      message.error(`图片大小不能超过 ${maxSize}MB！`);
      return false;
    }
    return true;
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      customRequest={customRequest}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      fileList={fileList}
    >
      {value ? (
        <Image
          src={getImageUrl(value)}
          alt="图片"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          preview={false}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}
