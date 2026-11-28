/**
 * Uploads an image (dataUrl, Blob, or File) to Cloudinary via /api/auth?action=upload-image.
 * If server upload fails or Cloudinary is not configured, returns the local dataUrl as fallback.
 */
export async function uploadImageToCloud(dataUrlOrFile) {
  try {
    let base64Data = dataUrlOrFile;
    if (typeof dataUrlOrFile !== 'string') {
      base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(dataUrlOrFile);
      });
    }

    const res = await fetch('/api/auth?action=upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Data }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        return { success: true, url: data.url, cloud: true };
      }
    }
  } catch (err) {
    console.warn('Cloud image upload fallback to local storage:', err.message);
  }

  // Graceful fallback to original dataUrl
  return {
    success: true,
    url: typeof dataUrlOrFile === 'string' ? dataUrlOrFile : null,
    cloud: false,
  };
}

