// Helper to manage can images with localStorage override support

const DEFAULT_IMAGES: Record<string, string> = {
  original: '/7up.png',
  zero: '/7up-zero-sugar.png',
  cherry: '/7up-cherry.png',
  tropical: '/7up-tropical.png',
};

export function getProductImage(productId: string): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(`custom_7up_can_${productId}`);
    if (custom) return custom;
  }
  return DEFAULT_IMAGES[productId] || '/7up.png';
}

export function setProductCustomImage(productId: string, dataUrl: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`custom_7up_can_${productId}`, dataUrl);
    window.dispatchEvent(new Event('7up_can_images_updated'));
  }
}

export function resetProductCustomImage(productId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`custom_7up_can_${productId}`);
    window.dispatchEvent(new Event('7up_can_images_updated'));
  }
}

export function resetAllCustomImages(): void {
  if (typeof window !== 'undefined') {
    ['original', 'zero', 'cherry', 'tropical'].forEach((id) => {
      localStorage.removeItem(`custom_7up_can_${id}`);
    });
    window.dispatchEvent(new Event('7up_can_images_updated'));
  }
}
