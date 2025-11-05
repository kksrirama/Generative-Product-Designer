
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageSelected: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelected(file);
    } else {
      setPreviewUrl(null);
      onImageSelected(null);
    }
  }, [onImageSelected]);

  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };
  
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
          ${isDragging ? 'border-purple-400 bg-slate-700/50' : 'border-slate-600 hover:border-purple-500 hover:bg-slate-700/30'}`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
            <UploadIcon />
            <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs">PNG, JPG, or WEBP</p>
          </div>
        )}
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => handleFileChange(e.target.files)} 
        />
      </label>
      {previewUrl && (
        <button 
          onClick={onButtonClick} 
          className="w-full mt-3 text-sm text-center text-purple-400 hover:text-purple-300"
        >
          Change image
        </button>
      )}
    </div>
  );
};
