"use client";

import { ChangeEvent, useCallback, useState } from "react";

interface UseImageUploadResult {
  image: string | null;
  error: string | null;
  isImageLoading: boolean;
  handleImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  resetImage: () => void;
}

const useImageUpload = (): UseImageUploadResult => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  const handleImageUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        setError("No file selected.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }

      setIsImageLoading(true);
      setError(null);

      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          setImage(reader.result as string);
        }
        setIsImageLoading(false);
      };

      reader.onerror = () => {
        setError("Failed to read the file.");
        setIsImageLoading(false);
      };

      reader.readAsDataURL(file);
    },
    []
  );

  const resetImage = () => {
    setImage(null);
    setError(null);
  };

  return { image, error, isImageLoading, handleImageUpload, resetImage };
};

export default useImageUpload;
