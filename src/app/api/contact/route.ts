import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const name = [body.fname, body.lname].filter(Boolean).join(" ") || body.name || "Anonymous";
    const email = body.email || "no-reply@lightsovercolumbus.com";
    const phone = body.phone || "";
    const address = body.address || "";
    const city = body.city || "";
    const notes = body.notes || body.message || "";
    const lightingAreas = body.lightingAreas || {};
    const selectedAreas = Object.keys(lightingAreas).filter(k => lightingAreas[k]).join(", ") || "None specified";

    const message = `
Quote Request Details:
Address: ${address}, ${city}
Lighting Areas: ${selectedAreas}
Budget: ${body.budget || "Not specified"}
Notes: ${notes}
    `.trim();

    const submission = await Submission.create({
      name,
      email,
      phone,
      subject: `New Holiday Lighting Quote: ${name} (${city})`,
      message,
      type: "Quote Request",
      source: "Homepage Quote Form",
      extraData: {
        firstName: body.fname,
        lastName: body.lname,
        address,
        city,
        budget: body.budget,
        notes,
        lightingAreas,
        colorPref: body.colorPref
      }
    });

    return NextResponse.json({ success: true, submissionId: submission._id });
  } catch (error: any) {
    console.error("Quote Submission API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
