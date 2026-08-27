import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Content from '@/models/Content';

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

    const submission = await Submission.create({
      name: name || 'Consultation Lead',
      email: email || 'no-email@provided.com',
      phone: phone || '',
      subject: `Free Consultation Request: ${serviceType || 'Seasonal Lighting'}`,
      message: message || `Preferred Date: ${preferredDate}, Preferred Time: ${preferredTime}, Address: ${address}`,
      type: 'Consultation Request',
      extraData: {
        address,
        serviceType,
        preferredDate,
        preferredTime,
        hearAbout
      }
    });

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
