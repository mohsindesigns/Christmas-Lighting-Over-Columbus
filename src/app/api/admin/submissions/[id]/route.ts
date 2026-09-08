import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import { hasPermission, getSessionUser } from '@/lib/rbac';
import { recordActivity } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasPermission(req, 'submissions', 'read'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await params;
    await connectDB();
    const submission = await Submission.findById(id);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }
    return NextResponse.json(submission);
  } catch (error: any) {
    console.error('Fetch Submission [id] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasPermission(req, 'submissions', 'delete'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await connectDB();
    const submission = await Submission.findByIdAndDelete(id);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const session = await getSessionUser(req);
    await recordActivity({
      user: (session as any)?.userId,
      userName: (session as any)?.username,
      action: 'DELETE_SUBMISSION',
      entity: 'Submission',
      details: { id, name: submission.name, email: submission.email },
      ip: req.headers.get('x-forwarded-for') || (req as any)?.ip || 'unknown'
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    console.error('Delete Submission [id] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
