import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function uploadToCloudinary(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64String = buffer.toString('base64');
  const dataURI = `data:${file.type};base64,${base64String}`;

  const formData = new FormData();
  formData.append('file', dataURI);
  formData.append('api_key', process.env.CLOUDINARY_KEY || '');
  formData.append('timestamp', Math.round((new Date).getTime()/1000).toString());
  formData.append('cloud_name', process.env.CLOUDINARY_NAME || '');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
}

async function uploadToLocal(file: File): Promise<string> {
  const fileExtension = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(uploadsDir, fileName), buffer);
  
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

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    let imageUrl: string;

    try {
      // Choose storage method based on environment
      if (process.env.NODE_ENV === 'production') {
        imageUrl = await uploadToCloudinary(file);
      } else {
        imageUrl = await uploadToLocal(file);
      }

      // Update user's profile in database with new image URL
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

      return NextResponse.json({ imageUrl });
    } catch (error) {
      console.error("Error handling file upload:", error);
      return NextResponse.json(
        { error: "Failed to handle file upload", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in upload-image route:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 