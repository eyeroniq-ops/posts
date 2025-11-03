import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      onImageUpload(files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [onImageUpload]);

  return (
    <div
      className={`relative w-full aspect-video border-2 border-dashed rounded-lg flex items-center justify-center text-center p-4 transition-colors duration-300 ${isDragging ? 'border-[var(--color-bright-pink)] bg-[var(--color-dark-pink)]/20' : 'border-[var(--color-dark-pink)] hover:border-[var(--color-bright-pink)]'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      {imageUrl ? (
        <img src={imageUrl} alt="Uploaded preview" className="max-w-full max-h-full object-contain rounded-md" />
      ) : (
        <div className="flex flex-col items-center text-[var(--color-light-pink)] opacity-80">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4H7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 16v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
          <p className="font-semibold">Haz clic para subir o arrastra y suelta</p>
          <p className="text-sm">PNG, JPG, WEBP, etc.</p>
        </div>
      )}
    </div>
  );
};