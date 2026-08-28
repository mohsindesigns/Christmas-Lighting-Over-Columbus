import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";
import connectToDatabase from "@/lib/mongodb";
import Media from "@/models/Media";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId, data } = await uploadFile(file, buffer);

    try {
      await connectToDatabase();
      await Media.create({
        url,
        publicId,
        name: file.name,
        type: file.type,
        size: file.size,
        data: data || undefined,
      });
    } catch (dbErr) {
      console.warn("Media DB record creation warning:", dbErr);
    }

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}
