"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "AccessDenied":
        return "Your account is not authorized to access the admin dashboard.";
      case "Configuration":
        return "Server configuration error. Please contact the administrator.";
      case "Verification":
        return "Email verification failed. Please try again.";
      default:
        return "An unexpected error occurred during sign in.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-matte-black">
      <div className="max-w-md w-full mx-auto bg-[#181825] rounded-lg shadow-neon p-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-500 mb-2">
              Authentication Error
            </h1>
            <p className="text-white/70 mb-6">
              {getErrorMessage(error)}
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="block w-full px-6 py-3 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 border-2 border-acid-magenta text-acid-magenta rounded-lg shadow-neon hover:bg-acid-magenta/20 neon transition duration-200 hover:scale-105 focus:ring-4 focus:ring-electric-purple/30 focus:outline-none"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-matte-black">
        <div className="max-w-md w-full mx-auto bg-[#181825] rounded-lg shadow-neon p-8">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-electric-purple mb-2">
                Loading...
              </h1>
            </div>
          </div>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
