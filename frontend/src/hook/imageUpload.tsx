"use client";

import { ChangeEvent, useState } from "react";

interface UseImageUploadResult {
  image: string | null;
  error: string | null;
  isLoading: boolean;
  handleImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  resetImage: () => void;
}

const useImageUpload = (): UseImageUploadResult => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setError("No file selected.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        setImage(reader.result as string);
      }
      setIsLoading(false);
    };

    reader.onerror = () => {
      setError("Failed to read the file.");
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const resetImage = () => {
    setImage(null);
    setError(null);
  };

  return { image, error, isLoading, handleImageUpload, resetImage };
};

export default useImageUpload;
