import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import fs from "fs";
import path from "path";

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
    return [];
  }
}

function writeUsers(users: User[]) {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function initializeDefaultAdmin() {
  const users = readUsers();
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || ["admin@wretcheddesigns.com"];

  // Create default admin if no users exist yet
  if (users.length === 0) {
    const defaultAdmin: User = {
      id: "admin",
      name: "Admin User",
      email: adminEmails[0],
      role: "admin",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      verified: true,
    };
    users.push(defaultAdmin);
    writeUsers(users);
  }
}

initializeDefaultAdmin();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user.email;
      if (!email) return false;

      const users = readUsers();
      let existingUser = users.find(u => u.email === email);

      // Create new user if they don't exist
      if (!existingUser) {
        existingUser = {
          id: crypto.randomUUID(),
          name: user.name || email.split('@')[0],
          email: email,
          role: 'user', // Default role for new users
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          verified: true, // OAuth-verified
        };
        users.push(existingUser);
        writeUsers(users);
      } else {
        // Update last login for existing user
        existingUser.lastLogin = new Date().toISOString();
        writeUsers(users);
      }

      // Add admin role for admin emails
      const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
      if (adminEmails.includes(email) && existingUser.role !== 'admin') {
        if (existingUser.id && users.find(u => u.id === existingUser!.id)) {
          const userIndex = users.findIndex(u => u.id === existingUser!.id);
          if (userIndex !== -1) {
            users[userIndex].role = 'admin';
            users[userIndex].lastLogin = new Date().toISOString();
            writeUsers(users);
          }
        }
      }

      return true; // Allow sign in for all OAuth users
    },
    async session({ session, token }) {
      const users = readUsers();
      const user = users.find(u => u.email === session.user?.email);

      if (user) {
        session.user = {
          ...session.user,
          role: user.role,
          id: user.id,
        };
      }

      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};
