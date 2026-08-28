import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const SECRET = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET || "cloc-admin-secret-key-change-me-in-env");

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function getAuthSession(req?: NextRequest) {
  let token: string | undefined;

  // 1. Check Authorization header
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  // 2. Check req.cookies
  if (!token && req && req.cookies) {
    token = req.cookies.get("admin_session")?.value;
  }

  // 3. Check raw Cookie header string
  if (!token && req) {
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(/admin_session=([^;]+)/);
      if (match) token = match[1];
    }
  }

  // 4. Check next/headers cookies()
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("admin_session")?.value;
    } catch (e) {
      // ignore
    }
  }

  if (!token) return null;
  return await verifyToken(token);
}
