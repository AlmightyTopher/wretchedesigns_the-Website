import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const runtime = 'edge';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
  verified: boolean;
}

const USERS_FILE = path.join(process.cwd(), "public/data/users.json");

function readUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Create default admin user if no users file exists
    const defaultUsers: User[] = [
      {
        id: "admin",
        name: "Admin User",
        email: process.env.ADMIN_EMAILS?.split(",")[0] || "admin@wretcheddesigns.com",
        role: "admin",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        verified: true,
      },
    ];
    writeUsers(defaultUsers);
    return defaultUsers;
  }
}

function writeUsers(users: User[]) {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// GET - Retrieve all users
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const users = readUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST - Add new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { name, email, role = "user" } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const users = readUsers();

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      role: role as 'user' | 'admin',
      createdAt: new Date().toISOString(),
      lastLogin: "Never",
      verified: false,
    };

    users.push(newUser);
    writeUsers(users);

    // TODO: Send invitation email or password reset link

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}

// PUT - Update user
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id, name, email, role } = await request.json();

    if (!id || !email) {
      return NextResponse.json({ error: "User ID and email are required" }, { status: 400 });
    }

    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent admin from removing their own admin privileges
    const user = users[userIndex];
    if (user.email === session.user.email && role !== "admin") {
      return NextResponse.json({ error: "You cannot remove your own admin privileges" }, { status: 400 });
    }

    users[userIndex] = {
      ...user,
      name: name || user.name,
      email: email || user.email,
      role: (role as 'user' | 'admin') || user.role,
    };

    writeUsers(users);
    return NextResponse.json(users[userIndex]);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE - Remove user
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const users = readUsers();
    const userToDelete = users.find(u => u.id === userId);

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent admin from deleting themselves
    if (userToDelete.email === session.user.email) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    writeUsers(updatedUsers);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
