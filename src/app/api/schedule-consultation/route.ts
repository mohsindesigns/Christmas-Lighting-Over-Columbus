import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import { sendEmail, getReceiverEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      serviceType,
      preferredDate,
      preferredTime,
      message,
      hearAbout
    } = body;

    const subject = `Free Consultation Request: ${serviceType || 'Seasonal Lighting'} - ${name || 'Lead'}`;
    const formattedMessage = message || `Preferred Date: ${preferredDate || 'Flexible'}, Preferred Time: ${preferredTime || 'Flexible'}, Address: ${address || 'Not provided'}`;

    const submission = await Submission.create({
      name: name || 'Consultation Lead',
      email: email || 'no-email@provided.com',
      phone: phone || '',
      subject,
      message: formattedMessage,
      type: 'Consultation Request',
      source: 'About Page Consultation Modal',
      extraData: {
        address,
        serviceType,
        preferredDate,
        preferredTime,
        hearAbout
      }
    });

    try {
      const receiver = await getReceiverEmail('Consultation Request');
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #059669; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 20px;">🗓️ Free Consultation Scheduled!</h1>
          </div>
          <div style="padding: 24px; background: white;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Service Type:</strong> ${serviceType}</p>
            <p><strong>Preferred Schedule:</strong> ${preferredDate} at ${preferredTime}</p>
            <p><strong>How they heard of us:</strong> ${hearAbout || 'Not specified'}</p>
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 15px;">
              <p><strong>Notes:</strong> ${message || 'None'}</p>
            </div>
          </div>
        </div>
      `;
      await sendEmail({
        to: receiver,
        subject,
        html: emailHtml,
        text: formattedMessage
      });
    } catch (mailErr) {
      console.warn('Consultation mail sending warning:', mailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Consultation request scheduled successfully',
      submissionId: submission._id
    });
  } catch (error: any) {
    console.error('Error scheduling consultation:', error);
    return NextResponse.json({
      error: 'Failed to schedule consultation',
      details: error.message
    }, { status: 500 });
  }
}
