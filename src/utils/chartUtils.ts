import { toPng } from 'html-to-image';

export const copyChartToClipboard = async (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) return false;

    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      quality: 1.0,
      pixelRatio: 2,
    });

    // Create a temporary canvas to get blob data
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    ctx.drawImage(img, 0, 0);
    
    // Convert canvas to blob and copy to clipboard
    const blob = await new Promise<Blob | null>(resolve => 
      canvas.toBlob(resolve, 'image/png', 1.0)
    );
    
    if (!blob) return false;

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ]);

    return true;
  } catch (error) {
    console.error('Error copying chart:', error);
    return false;
  }
};