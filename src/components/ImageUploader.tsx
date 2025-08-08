'use client';

import React, { useRef, useState } from 'react';
import { Upload, Clipboard, X, Eye } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void;
  onClipboardPaste: () => void;
  currentImage?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  onClipboardPaste, 
  currentImage 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onImageUpload(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    onImageUpload('');
  };

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium">Click to upload</span> or drag and drop
          </div>
          <div className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </button>
        <button
          type="button"
          onClick={onClipboardPaste}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Clipboard className="h-4 w-4 mr-2" />
          Paste from Clipboard
        </button>
      </div>

      {/* Current Image Info */}
      {currentImage && (
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Image uploaded ({Math.round(currentImage.length / 1024)} KB)
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Image Preview Modal */}
      {showPreview && currentImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Image Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={currentImage}
                alt="Preview"
                className="max-w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;