import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Role from '@/models/Role';
import { signToken } from '@/lib/auth';
import { recordActivity } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown';
  
  try {
    const body = await req.json();
    const { username, password } = body;

    await connectToDatabase();

    // Find user and populate role
    const user = await User.findOne({ username }).populate('role');

    if (!user) {
      await recordActivity({
        action: 'LOGIN_FAILURE',
        userName: username,
        ip,
        status: 'failure',
        details: { message: 'User not found' }
      });
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    if (user.status !== 'active') {
      await recordActivity({
        user: user._id,
        userName: user.username,
        action: 'LOGIN_FAILURE',
        ip,
        status: 'failure',
        details: { message: 'Account is disabled' }
      });
      return NextResponse.json({ error: 'Your account has been disabled.' }, { status: 403 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await recordActivity({
        user: user._id,
        userName: user.username,
        action: 'LOGIN_FAILURE',
        ip,
        status: 'failure',
        details: { message: 'Incorrect password' }
      });
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    // Success
    user.lastLogin = new Date();
    await user.save();

    const userRole = user.role || {};
    const roleName = userRole.name || 'Admin';
    const defaultPermissions = {
      pages: { create: true, read: true, update: true, delete: true, publish: true },
      media: { create: true, read: true, update: true, delete: true },
      seo: { read: true, update: true },
      blog: { create: true, read: true, update: true, delete: true, publish: true },
      submissions: { read: true, delete: true },
      settings: { read: true, update: true },
      users: { read: true, create: true, update: true, delete: true },
      logs: { read: true }
    };
    const rolePermissions = userRole.permissions ? JSON.parse(JSON.stringify(userRole.permissions)) : defaultPermissions;

    const token = await signToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      roleName: roleName,
      permissions: user.customPermissions || rolePermissions
    });

    await recordActivity({
      user: user._id,
      userName: user.username,
      action: 'LOGIN_SUCCESS',
      ip,
      status: 'success'
    });

    const response = NextResponse.json({ 
      success: true,
      token,
      user: {
        username: user.username,
        email: user.email,
        role: roleName
      }
    });

    response.cookies.set('admin_session', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
