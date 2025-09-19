import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin system not configured" }, { status: 503 });
    }

    if (password === adminPassword) {
      // Create a simple admin token
      const adminToken = btoa(`admin:${Date.now()}`);

      const response = NextResponse.json({
        success: true,
        token: adminToken,
        email: "admin@wretchedesigns.com"
      });

      // Set admin cookie
      response.cookies.set('admin-token', adminToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const adminToken = request.cookies.get('admin-token')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || !adminToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    // Simple token validation
    const decoded = atob(adminToken);
    const [user, timestamp] = decoded.split(':');

    if (user === 'admin' && timestamp) {
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 60 * 60 * 24 * 1000; // 24 hours in ms

      if (tokenAge < maxAge) {
        return NextResponse.json({
          authenticated: true,
          user: { email: "admin@wretchedesigns.com" }
        });
      }
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin-token');
  return response;
}