import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import { sendEmail, getReceiverEmail } from '@/lib/email';
import { uploadFile } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    await connectDB();
    const contentType = request.headers.get('content-type') || '';
    let name, email, phone, message, subject, type, extraData: any = {};
    let attachmentUrls: string[] = [];
    let emailAttachments: any[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = formData.get('name') as string;
      email = formData.get('email') as string;
      phone = formData.get('phone') as string;
      message = formData.get('message') as string;
      subject = formData.get('subject') as string || formData.get('_subject') as string;
      type = formData.get('type') as string || 'Career Application';

      // Process any uploaded files
      const possibleFileKeys = ['attachment', 'file', 'files', 'resume', 'photo', 'images'];
      for (const key of possibleFileKeys) {
        const files = formData.getAll(key);
        for (const item of files) {
          if (item && typeof item === 'object' && 'arrayBuffer' in item && (item as File).size > 0) {
            const file = item as File;
            try {
              const buffer = Buffer.from(await file.arrayBuffer());
              const { url } = await uploadFile(file, buffer);
              if (url) {
                attachmentUrls.push(url);
                emailAttachments.push({
                  filename: file.name,
                  content: buffer,
                  contentType: file.type
                });
              }
            } catch (fileErr) {
              console.warn('File processing error:', fileErr);
            }
          }
        }
      }

      // Collect other fields
      formData.forEach((value, key) => {
        if (!['name', 'email', 'phone', 'message', 'subject', '_subject', 'type', 'attachment', 'file', 'files', 'resume', 'photo', 'images', '_captcha', '_template'].includes(key)) {
          if (typeof value === 'string') {
            extraData[key] = value;
          }
        }
      });
    } else {
      const body = await request.json();
      ({ name, email, phone, message, subject, type, ...extraData } = body);
      if (body.attachmentUrl) attachmentUrls.push(body.attachmentUrl);
      if (Array.isArray(body.attachmentUrls)) attachmentUrls.push(...body.attachmentUrls);
      if (Array.isArray(body.images)) attachmentUrls.push(...body.images);
    }

    // Deduplicate attachmentUrls
    attachmentUrls = Array.from(new Set(attachmentUrls.filter(Boolean)));
    const attachmentUrl = attachmentUrls[0] || undefined;

    // Resilience: ensure required fields
    name = name || extraData.name || extraData.fullname || extraData.fullName || extraData.contact_name || 'Anonymous';
    email = email || extraData.email || extraData.user_email || extraData.contact_email || 'no-email@provided.com';
    message = message || extraData.message || extraData.comments || extraData.inquiry || 'No message content provided.';

    // Save to Database
    let submission;
    try {
      submission = await Submission.create({
        name,
        email,
        phone,
        subject: subject || `New Submission: ${name}`,
        message,
        type: type || 'Contact Form',
        attachmentUrl,
        attachmentUrls,
        extraData: {
          ...extraData,
          images: attachmentUrls
        }
      });
    } catch (dbError: any) {
      console.error('DATABASE SAVE ERROR:', dbError);
    }

    const receiver = await getReceiverEmail(type);
    const emailSubject = subject || `✨ Christmas Lights Over Columbus - New Lead: ${name}`;

    // Construct Email HTML
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #2563eb; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">✨ New ${type || 'Website'} Submission</h1>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 100px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="tel:${phone}">${phone || 'Not provided'}</a></td>
            </tr>
          </table>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin-top: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Message Content:</p>
            <div style="color: #0f172a; line-height: 1.6; white-space: pre-wrap;">${message}</div>
          </div>

          ${attachmentUrls.length > 0 ? `
            <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
              <p style="margin: 0 0 10px; font-weight: bold; color: #0f172a;">📎 Attached Files & Photos (${attachmentUrls.length}):</p>
              ${attachmentUrls.map(url => `
                <div style="margin-bottom: 8px;">
                  <a href="${url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${url}`}" target="_blank" style="color: #2563eb; text-decoration: underline; font-weight: 500;">
                    ${url} ↗
                  </a>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
            ⏱️ Submitted: ${new Date().toLocaleString()} | Source: Website
          </p>
        </div>
      </div>
    `;

    // Send email using unified service
    await sendEmail({
      to: receiver,
      subject: emailSubject,
      html: emailHtml,
      text: message,
      attachments: emailAttachments
    });

    return NextResponse.json({
      success: true,
      message: 'Submission saved and email notification triggered',
      submissionId: submission?._id
    });

  } catch (error: any) {
    console.error('CRITICAL API ERROR IN /api/send:', error);
    return NextResponse.json({
      error: 'Server error',
      details: error.message,
    }, { status: 500 });
  }
}
