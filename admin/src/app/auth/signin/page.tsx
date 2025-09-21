"use client";

import { getProviders, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Provider = {
  id: string;
  name: string;
};

export default function SignInPage() {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Redirect if already signed in
    if (status === "authenticated") {
      router.push("/admin");
      return;
    }

    // Fetch providers
    const loadProviders = async () => {
      try {
        const res = await fetch("/api/auth/providers");
        const data = await res.json();
        setProviders(data);
      } catch (error) {
        console.error("Error loading providers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, [session, status, router]);

  const handleSignIn = (providerId: string) => {
    setLoading(true);
    signIn(providerId, { callbackUrl: "/admin" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-matte-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-magenta text-xl mb-4">Connecting to Authentication...</div>
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-matte-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-[#1c002e] to-[#0c001a] rounded-lg p-8 shadow-neon border border-neon-magenta/30">
          <div className="text-center mb-8">
            <h1 className="glitch text-3xl font-header font-bold text-electric-purple glow mb-4">
              Wretched Designs
            </h1>
            <h2 className="text-xl font-header text-neon-magenta mb-2">Admin Authentication</h2>
            <p className="text-white/80 text-sm">Sign in to access the admin panel</p>
          </div>

          <div className="space-y-4">
            {providers && Object.values(providers).map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleSignIn(provider.id)}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-electric-purple to-acid-magenta text-white font-header text-lg rounded-lg shadow-neon neon transition-all duration-200 hover:scale-105 focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : `Sign in with ${provider.name}`}
              </button>
            ))}

            {!providers && (
              <div className="w-full px-6 py-4 bg-black/50 border-2 border-dashed border-neon-magenta/30 rounded-lg text-center">
                <div className="text-red-400 text-sm mb-2">Configuration Error</div>
                <div className="text-white/60 text-xs">
                  Google OAuth providers not configured. Check your environment variables.
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <div className="bg-black/30 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">Admin Access</h3>
              <p className="text-white/60 text-sm">
                Only users with admin privileges can access this area.
              </p>
              <p className="text-electric-purple/70 text-xs mt-2">
                Contact your administrator to get access.
              </p>
            </div>

            <Link
              href="/"
              className="text-neon-magenta hover:text-electric-purple transition duration-200 inline-block mt-4"
            >
              ← Back to Customer Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
