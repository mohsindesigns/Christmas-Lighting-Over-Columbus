import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Media from "@/models/Media";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!filename) {
    return new NextResponse("File not found", { status: 404 });
  }

  // 1. Try reading from local disk if it exists
  try {
    const localPath = path.join(process.cwd(), "public", "uploads", filename);
    if (existsSync(localPath)) {
      const fileBuffer = await readFile(localPath);
      const ext = path.extname(filename).toLowerCase().replace(".", "");
      const mimeTypes: { [key: string]: string } = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        svg: "image/svg+xml",
        gif: "image/gif",
        avif: "image/avif"
      };
      const contentType = mimeTypes[ext] || "image/jpeg";

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch (err) {
    // Disk read failed, fallback to MongoDB
  }

  // 2. Query MongoDB for the image data
  try {
    await connectToDatabase();
    
    // Find media by filename, url, or publicId
    const mediaItem = await Media.findOne({
      $or: [
        { publicId: filename },
        { name: filename },
        { url: `/uploads/${filename}` },
        { url: `/api/uploads/${filename}` },
        { url: { $regex: filename, $options: "i" } }
      ]
    }).lean() as any;

    if (mediaItem && mediaItem.data) {
      const buffer = Buffer.from(mediaItem.data, "base64");
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": mediaItem.type || "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return new NextResponse("Image not found", { status: 404 });
  } catch (err: any) {
    console.error("Error serving uploaded media from DB:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
