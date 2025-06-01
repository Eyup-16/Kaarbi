import { CldImage } from 'next-cloudinary';

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
};

export { CldImage }; 