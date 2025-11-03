import React from 'react';
import { Loader } from './Loader';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, isLoading, error }) => {
  return (
    <div className="w-full aspect-video bg-[var(--color-dark)] rounded-lg flex items-center justify-center p-2 border border-[var(--color-dark-pink)]">
      {isLoading && <Loader />}
      {!isLoading && error && (
        <div className="text-center text-[var(--color-bright-pink)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold">Ocurrió un error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {!isLoading && !error && imageUrl && (
        <img src={imageUrl} alt="Generated result" className="max-w-full max-h-full object-contain rounded-md" />
      )}
      {!isLoading && !error && !imageUrl && (
        <div className="text-center text-[var(--color-light-pink)] opacity-70">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Tu imagen generada aparecerá aquí</p>
        </div>
      )}
    </div>
  );
};