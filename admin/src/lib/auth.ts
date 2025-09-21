import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  lastLogin: string;
}

// Get admin emails from environment
const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // Check if user is in admin list
      if (adminEmails.includes(user.email)) {
        return true;
      }

      // For development/demo, allow all Gmail users
      if (user.email.includes('@gmail.com')) {
        return true;
      }

      // Block non-admin, non-Gmail users
      return false;
    },
    async session({ session, user, token }) {
      if (session.user?.email && adminEmails.includes(session.user.email)) {
        session.user.role = 'admin';
      } else if (session.user?.email?.includes('@gmail.com')) {
        session.user.role = 'user';
      }

      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user?.email && adminEmails.includes(user.email)) {
        token.role = 'admin';
      } else if (user?.email?.includes('@gmail.com')) {
        token.role = 'user';
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
};
