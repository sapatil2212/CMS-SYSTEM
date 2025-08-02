'use client';

import React, { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  onUploadError?: (error: string) => void;
  folder?: string;
  className?: string;
  children?: React.ReactNode;
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  onUpload,
  currentImage,
  onUploadError,
  folder = 'cms-uploads',
  className = '',
  children
}) => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className={className}>
      {currentImage && (
        <div className="mb-3">
          <img 
            src={currentImage} 
            alt="Current image" 
            className="h-20 w-auto rounded border"
          />
        </div>
      )}
      <CldUploadWidget
        uploadPreset="cms_uploads"
        options={{
          maxFiles: 1,
          folder: folder,
          resourceType: 'image',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          maxFileSize: 5000000, // 5MB
        }}
        onUpload={(result: any) => {
          if (result.event === 'success') {
            setIsUploading(false);
            onUpload(result.info.secure_url);
          } else if (result.event === 'progress') {
            setIsUploading(true);
          }
        }}
        onError={(error: any) => {
          setIsUploading(false);
          console.error('Upload error:', error);
          onUploadError?.(error.message || 'Upload failed');
        }}
      >
        {({ open }) => (
          <div>
            {children || (
              <button
                type="button"
                onClick={() => open()}
                disabled={isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </button>
            )}
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
}; 