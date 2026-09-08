import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import { hasPermission, getSessionUser } from '@/lib/rbac';
import { recordActivity } from '@/lib/logger';

export async function GET(req: NextRequest) {
  if (!(await hasPermission(req, 'submissions', 'read'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connectDB();
    const submissions = await Submission.find({}).sort({ createdAt: -1 });

    const session = await getSessionUser(req);
    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'VIEW_SUBMISSIONS',
      entity: 'Submission',
      details: { count: submissions.length },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    return NextResponse.json(submissions);
  } catch (error: any) {
    console.error('Fetch Submissions Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await hasPermission(req, 'submissions', 'delete'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connectDB();
    let ids: string[] = [];

    const { searchParams } = new URL(req.url);
    const queryId = searchParams.get('id');
    if (queryId) {
      ids.push(queryId);
    }

    try {
      const body = await req.json();
      if (body.id && typeof body.id === 'string' && !ids.includes(body.id)) {
        ids.push(body.id);
      }
      if (Array.isArray(body.ids)) {
        body.ids.forEach((id: string) => {
          if (id && typeof id === 'string' && !ids.includes(id)) {
            ids.push(id);
          }
        });
      }
    } catch {
      // Body may be empty if query params were used
    }

    if (ids.length === 0) {
      return NextResponse.json({ error: 'No submission ID(s) provided' }, { status: 400 });
    }

    const result = await Submission.deleteMany({ _id: { $in: ids } });

    const session = await getSessionUser(req);
    await recordActivity({
      user: (session as any)?.userId,
      userName: (session as any)?.username,
      action: ids.length > 1 ? 'BULK_DELETE_SUBMISSIONS' : 'DELETE_SUBMISSION',
      entity: 'Submission',
      details: { count: result.deletedCount, ids },
      ip: req.headers.get('x-forwarded-for') || (req as any)?.ip || 'unknown'
    });

    return NextResponse.json({ success: true, count: result.deletedCount });
  } catch (error: any) {
    console.error('Delete Submissions Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
