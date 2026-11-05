import { useState, useEffect } from 'react';
import { getProductImage } from './productImages';

export function useCanImage(productId: string): string {
  const [imageSrc, setImageSrc] = useState<string>(() => getProductImage(productId));

  useEffect(() => {
    const handleUpdate = () => {
      setImageSrc(getProductImage(productId));
    };

    window.addEventListener('7up_can_images_updated', handleUpdate);
    // Initial sync
    handleUpdate();

    return () => {
      window.removeEventListener('7up_can_images_updated', handleUpdate);
    };
  }, [productId]);

  return imageSrc;
}

export function useAllCanImages(): Record<string, string> {
  const [images, setImages] = useState<Record<string, string>>(() => ({
    original: getProductImage('original'),
    zero: getProductImage('zero'),
    cherry: getProductImage('cherry'),
    tropical: getProductImage('tropical'),
  }));

  useEffect(() => {
    const handleUpdate = () => {
      setImages({
        original: getProductImage('original'),
        zero: getProductImage('zero'),
        cherry: getProductImage('cherry'),
        tropical: getProductImage('tropical'),
      });
    };

    window.addEventListener('7up_can_images_updated', handleUpdate);
    handleUpdate();

    return () => {
      window.removeEventListener('7up_can_images_updated', handleUpdate);
    };
  }, []);

  return images;
}
