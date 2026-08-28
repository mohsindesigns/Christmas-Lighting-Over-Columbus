import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Universal upload function that handles Cloudinary, MongoDB storage, and local disk fallback
 */
export async function uploadFile(
  file: File, 
  buffer: Buffer
): Promise<{ url: string; publicId?: string; data?: string }> {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const cloudinaryUrl = process.env.CLOUDINARY_URL;

  // Parse CLOUDINARY_URL if provided
  if (cloudinaryUrl && !cloudName) {
    try {
      const url = new URL(cloudinaryUrl);
      cloudName = url.hostname;
      apiKey = url.username;
      apiSecret = url.password;
    } catch (err) {
      console.error('Failed to parse CLOUDINARY_URL');
    }
  }

  // 1. Use Cloudinary if configured
  if (cloudName && (uploadPreset || (apiKey && apiSecret))) {
    try {
      const formData = new FormData();
      formData.append('file', new Blob([buffer], { type: file.type }));
      
      const dotIdx = file.name.lastIndexOf('.');
      const baseName = dotIdx !== -1 ? file.name.substring(0, dotIdx) : file.name;
      const cleanFileName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
      formData.append('public_id', cleanFileName);
      
      let endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      
      if (uploadPreset) {
        formData.append('upload_preset', uploadPreset);
      } else if (apiKey && apiSecret) {
        const timestamp = Math.round(new Date().getTime() / 1000).toString();
        formData.append('timestamp', timestamp);
        formData.append('api_key', apiKey);
        
        const { createHash } = await import('crypto');
        const signatureStr = `public_id=${cleanFileName}&timestamp=${timestamp}${apiSecret}`;
        const signature = createHash('sha1').update(signatureStr).digest('hex');
        formData.append('signature', signature);
      }
      
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok || data.error) {
        console.warn('Cloudinary Upload Failed, falling back to database storage:', data.error);
      } else {
        return {
          url: data.secure_url,
          publicId: data.public_id
        };
      }
    } catch (error: any) {
      console.warn('Cloudinary Process Warning:', error.message);
    }
  }

  // 2. Database & Local Storage Fallback (Guaranteed to work in production on Vercel, Netlify, VPS, Docker)
  const dotIdx = file.name.lastIndexOf('.');
  const ext = dotIdx !== -1 ? file.name.substring(dotIdx) : '';
  const baseName = dotIdx !== -1 ? file.name.substring(0, dotIdx) : file.name;
  const cleanBase = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${Date.now()}_${cleanBase}${ext}`;
  const base64Data = buffer.toString('base64');

  // Try saving to local disk if directory is writable (e.g. Local Dev or VPS)
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
  } catch (fsErr) {
    // Read-only filesystem in serverless environments (Vercel) - safely ignore because DB serves it
  }

  return {
    url: `/api/uploads/${filename}`,
    publicId: filename,
    data: base64Data
  };
}
