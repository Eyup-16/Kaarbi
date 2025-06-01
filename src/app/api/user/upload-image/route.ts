import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import crypto from 'crypto';

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function generateCloudinarySignature(params: Record<string, string>): string {
  const secret = process.env.CLOUDINARY_API_SECRET || '';
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc: Record<string, string>, key) => {
      acc[key] = params[key];
      return acc;
    }, {});

  const stringToSign = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return crypto
    .createHash('sha1')
    .update(stringToSign + secret)
    .digest('hex');
}

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  const timestamp = Math.round(Date.now()/1000).toString();
  const params = {
    timestamp,
    folder: 'kaarbi-uploads',
    invalidate: 'true',
    overwrite: 'true',
    unique_filename: 'true',
    use_filename: 'true'
  };

  const signature = generateCloudinarySignature(params);
  
  formData.append('file', file);
  formData.append('api_key', process.env.CLOUDINARY_API_KEY || '');
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', params.folder);
  formData.append('invalidate', params.invalidate);
  formData.append('overwrite', params.overwrite);
  formData.append('unique_filename', params.unique_filename);
  formData.append('use_filename', params.use_filename);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
}

async function uploadToLocal(file: File): Promise<string> {
  const fileExtension = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const uploadsDir = join(process.cwd(), "public", "uploads");
  
  await mkdir(uploadsDir, { recursive: true });
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const filepath = join(uploadsDir, fileName);
  await writeFile(filepath, buffer);
  
  return `/uploads/${fileName}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    let imageUrl: string;

    try {
      if (process.env.NODE_ENV === 'production') {
        imageUrl = await uploadToCloudinary(file);
      } else {
        imageUrl = await uploadToLocal(file);
      }

      const requestHeaders = await headers();
      const response = await fetch(`${process.env.BETTER_AUTH_URL}/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cookie": requestHeaders.get("cookie") || "",
        },
        body: JSON.stringify({
          name: session.user.name,
          image: imageUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to update user profile: ${errorData.error || response.statusText}`);
      }

      return NextResponse.json({ 
        imageUrl,
        storage: process.env.NODE_ENV === 'production' ? "cloudinary" : "local"
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to handle file upload", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 