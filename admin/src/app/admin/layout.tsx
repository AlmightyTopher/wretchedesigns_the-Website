"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    // Redirect non-admin users from KMD
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  const navigation = [
    { name: "Dashboard", href: "/admin", current: pathname === "/admin" },
    { name: "Gallery", href: "/admin/gallery", current: pathname === "/admin/gallery" },
    { name: "Products", href: "/admin/products", current: pathname === "/admin/products" },
    { name: "Users", href: "/admin/users", current: pathname === "/admin/users" },
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-matte-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-magenta text-xl mb-4">Loading Admin Panel...</div>
          <div className="animate-pulse">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-matte-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Access Denied</div>
          <p className="text-white/70 mb-6">You must be signed in with admin privileges to access this area.</p>
          <Link
            href="/auth/signin"
            className="px-6 py-3 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105"
          >
            Sign In with Google
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-matte-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#181825] border-r border-neon-magenta/30 min-h-screen">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-3 select-none mb-8">
            <span className="glitch text-2xl font-header tracking-wide drop-shadow-md select-none" style={{ color: "#3A7CA5" }}>
              Wretched
            </span>
            <span className="font-header font-bold text-acid-magenta glow text-lg tracking-widest select-none">
              Admin
            </span>
          </Link>

          {/* User Info */}
          <div className="mb-8 p-4 bg-black/20 rounded-lg border border-neon-magenta/20">
            <div className="text-white/80 text-sm mb-2">Logged in as:</div>
            <div className="text-white text-sm font-medium truncate">{session?.user?.email}</div>
            <div className="text-electric-purple/70 text-xs mt-1">Admin Access</div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block w-full px-4 py-3 text-left rounded-lg transition-all duration-200 border ${
                  item.current
                    ? "bg-electric-purple text-white border-electric-purple shadow-neon neon"
                    : "text-white/80 hover:text-electric-purple hover:bg-black/20 hover:border-neon-magenta/50 border-transparent"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* View Customer Site Button */}
            <Link
              href="/"
              className="block w-full px-4 py-3 text-left rounded-lg mt-6 text-neon-magenta hover:bg-black/20 hover:text-electric-purple transition-all duration-200 border border-neon-magenta/50"
              target="_blank"
            >
              View Customer Site
            </Link>

            {/* Sign Out Button */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block w-full px-4 py-3 text-left rounded-lg text-acid-magenta hover:bg-black/20 hover:text-electric-purple transition-all duration-200 border border-acid-magenta/50"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
