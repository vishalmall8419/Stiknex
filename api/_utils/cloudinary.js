import crypto from 'crypto';

/**
 * Uploads a base64 image or image buffer to Cloudinary using official REST API.
 * Does not require external npm packages.
 */
export async function uploadToCloudinary(fileDataOrBase64, folder = 'stiknex') {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret || cloudName === 'root' || cloudName === 'your_cloudinary_cloud_name') {
    throw new Error('Cloudinary credentials incomplete. Please set CLOUDINARY_CLOUD_NAME in environment settings.');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  const formData = new URLSearchParams();
  formData.append('file', fileDataOrBase64);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `Cloudinary upload failed (HTTP ${res.status})`);
  }

  return {
    url: data.secure_url || data.url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
  };
}

