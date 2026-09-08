import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import { sendEmail, getReceiverEmail } from '@/lib/email';

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
    const selectedAreas = typeof lightingAreas === 'object' && lightingAreas !== null
      ? Object.keys(lightingAreas).filter(k => lightingAreas[k]).join(", ") || "None specified"
      : String(lightingAreas || "None specified");

    const attachmentUrl = body.attachmentUrl || (Array.isArray(body.attachmentUrls) && body.attachmentUrls[0]) || undefined;
    const attachmentUrls = Array.isArray(body.attachmentUrls) ? body.attachmentUrls : (attachmentUrl ? [attachmentUrl] : []);

    const message = `
Quote Request Details:
${address || city ? `Address: ${address}${city ? `, ${city}` : ''}\n` : ''}Lighting Areas: ${selectedAreas}
Budget: ${body.budget || "Not specified"}
Notes / Project Details: ${notes}
${attachmentUrls.length > 0 ? `\nAttached Photos: ${attachmentUrls.length} file(s)` : ''}
    `.trim();

    const subject = `🎄 New Holiday Lighting Quote: ${name}${city ? ` (${city})` : ''}`;

    const submission = await Submission.create({
      name,
      email,
      phone,
      subject,
      message,
      type: "Quote Request",
      source: body.source || "Website Form",
      attachmentUrl,
      attachmentUrls,
      extraData: {
        firstName: body.fname,
        lastName: body.lname,
        address,
        city,
        budget: body.budget,
        notes,
        lightingAreas: selectedAreas,
        colorPref: body.colorPref,
        images: attachmentUrls
      }
    });

    // Send email notification asynchronously
    try {
      const receiver = await getReceiverEmail('Quote Request');
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #dc2626, #16a34a); padding: 24px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 22px;">🎄 New Holiday Lighting Lead!</h1>
            <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Christmas Lights Over Columbus</p>
          </div>
          <div style="padding: 24px; background: #ffffff;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr><td style="padding: 8px 0; color: #64748b; width: 120px;"><strong>Customer:</strong></td><td style="color: #0f172a; font-weight: 600;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td><td><a href="tel:${phone}" style="color: #2563eb; font-weight: 600;">${phone || 'Not provided'}</a></td></tr>
              ${address || city ? `<tr><td style="padding: 8px 0; color: #64748b;"><strong>Address:</strong></td><td>${address} ${city}</td></tr>` : ''}
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Lighting Areas:</strong></td><td>${selectedAreas}</td></tr>
              ${body.budget ? `<tr><td style="padding: 8px 0; color: #64748b;"><strong>Budget:</strong></td><td>${body.budget}</td></tr>` : ''}
            </table>

            <div style="background: #f8fafc; border-left: 4px solid #16a34a; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
              <p style="margin: 0 0 6px; color: #475569; font-size: 12px; text-transform: uppercase; font-weight: bold;">Notes / Details:</p>
              <p style="margin: 0; color: #1e293b; font-style: italic; white-space: pre-wrap;">${notes || 'No additional notes'}</p>
            </div>

            ${attachmentUrls.length > 0 ? `
              <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                <p style="margin: 0 0 10px; font-weight: bold; color: #0f172a;">📎 Attached Photos (${attachmentUrls.length}):</p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  ${attachmentUrls.map((url: string) => `
                    <a href="${url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${url}`}" target="_blank" style="display: inline-block; padding: 8px 12px; background: #e0e7ff; color: #3730a3; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500;">
                      View Attached Photo ↗
                    </a>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
              Submitted via Website Quote Form at ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `;

      await sendEmail({
        to: receiver,
        subject,
        html: emailHtml,
        text: message
      });
    } catch (mailErr) {
      console.warn("Mail notification warning:", mailErr);
    }

    return NextResponse.json({ success: true, submissionId: submission._id });
  } catch (error: any) {
    console.error("Quote Submission API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
