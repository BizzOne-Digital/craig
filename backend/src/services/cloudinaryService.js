import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';

export function configureCloudinary() {
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    return false;
  }
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
  return true;
}

export async function uploadImage(buffer, folder = 'jlf/products') {
  if (!configureCloudinary()) {
    throw Object.assign(new Error('Cloudinary is not configured'), { statusCode: 503 });
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId) {
  if (!publicId || !configureCloudinary()) return;
  await cloudinary.uploader.destroy(publicId);
}

export function isCloudinaryConfigured() {
  return configureCloudinary();
}
