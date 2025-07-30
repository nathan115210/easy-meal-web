import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const CLOUDINARY_UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER!;

export async function uploadImageToCloudinary(buffer: Buffer, slug: string, customFolderName?: string): Promise<string> {
  //"easy-meal/my-slug"
  const publicId = `${customFolderName || CLOUDINARY_UPLOAD_FOLDER}/${slug}`;
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          public_id: publicId, // e.g., "easy-meal-web/my-slug"
          overwrite: true,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            return reject(error || new Error('No URL returned'));
          }
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}
