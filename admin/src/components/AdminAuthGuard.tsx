"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  lastLogin: string;
}

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check admin authentication on client side
    const checkAuth = () => {
      const authCookie = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('admin_auth='))
        ?.split('=')[1];

      if (!authCookie) {
        setLoading(false);
        console.log('No admin auth cookie found');
        return;
      }

      try {
        const userData = JSON.parse(decodeURIComponent(authCookie));
        if (userData.role === 'admin') {
          setUser(userData);
        } else {
          console.log('Invalid admin user data');
          // Clear invalid cookie
          document.cookie = 'admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
      } catch (error) {
        console.error('Error parsing admin auth:', error);
        // Clear malformed cookie
        document.cookie = 'admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-matte-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-magenta text-xl mb-4">Loading Admin Panel...</div>
          <div className="animate-pulse">Please wait</div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to admin login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/admin-login';
    }
    return null;
  }

  return <>{children}</>;
}
