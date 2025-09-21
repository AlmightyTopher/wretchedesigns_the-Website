"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployMessage, setDeployMessage] = useState("");

  const finalizeAndDeploy = async () => {
    if (isDeploying) return;

    const confirmDeploy = confirm(
      "This will save all changes and deploy to the live website. Continue?"
    );

    if (!confirmDeploy) return;

    try {
      setIsDeploying(true);
      setDeployMessage("🚀 Deploying changes...");

      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Admin deployment: ${new Date().toLocaleString()}`
        })
      });

      const result = await response.json();

      if (result.success) {
        setDeployMessage("✅ " + result.message);
        setTimeout(() => {
          setDeployMessage("");
        }, 5000);
      } else {
        setDeployMessage("❌ " + result.error);
        setTimeout(() => {
          setDeployMessage("");
        }, 8000);
      }
    } catch (error) {
      setDeployMessage("❌ Failed to deploy: " + (error instanceof Error ? error.message : "Unknown error"));
      setTimeout(() => {
        setDeployMessage("");
      }, 8000);
    } finally {
      setIsDeploying(false);
    }
  };

  const stats = [
    { name: "Gallery Images", value: "33", href: "/admin/gallery" },
    { name: "Products", value: "9", href: "/admin/products" },
    { name: "Users", value: "2", href: "/admin/users" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="glitch text-4xl mb-4 neon" style={{ color: "#3A7CA5" }}>
          Admin Dashboard
        </h1>
        <p className="text-xl text-white/90">
          Welcome back, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-[#181825] rounded-lg shadow-neon p-6 hover:scale-105 transition-transform duration-200 border border-neon-magenta/20 hover:border-electric-purple/50"
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-electric-purple neon">
                {stat.value}
              </p>
              <p className="text-sm text-white/70 mt-2">{stat.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-[#181825] rounded-lg shadow-neon p-6 border border-neon-magenta/20">
          <h2 className="text-xl font-header text-acid-magenta mb-4">Gallery Management</h2>
          <p className="text-white/70 mb-4">
            Add, remove, and reorder images in the gallery. Changes are automatically saved and will be visible on the live site.
          </p>
          <Link
            href="/admin/gallery"
            className="inline-block px-6 py-2 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none"
          >
            Manage Gallery
          </Link>
        </div>

        <div className="bg-[#181825] rounded-lg shadow-neon p-6 border border-neon-magenta/20">
          <h2 className="text-xl font-header text-acid-magenta mb-4">Product Management</h2>
          <p className="text-white/70 mb-4">
            Add new products, edit descriptions and pricing, and manage your store inventory. Stripe integration coming soon.
          </p>
          <Link
            href="/admin/products"
            className="inline-block px-6 py-2 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none"
          >
            Manage Products
          </Link>
        </div>

        <div className="bg-[#181825] rounded-lg shadow-neon p-6 border border-neon-magenta/20">
          <h2 className="text-xl font-header text-acid-magenta mb-4">User Management</h2>
          <p className="text-white/70 mb-4">
            Add new users, manage permissions, and remove users from the system. Control who has access to your admin area.
          </p>
          <Link
            href="/admin/users"
            className="inline-block px-6 py-2 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none"
          >
            Manage Users
          </Link>
        </div>
      </div>

      {/* Finalize Deploy Button */}
      <div className="mt-12 text-center bg-[#181825] rounded-lg shadow-neon p-8 border border-electric-purple/50">
        <h3 className="text-2xl font-header text-electric-purple neon mb-6">Deploy Changes</h3>
        <p className="text-white/70 mb-6">
          Ready to publish your changes to the live site? This will save all data, commit to GitHub, and rebuild the customer site automatically.
        </p>

        {deployMessage && (
          <div className="mb-6 p-4 bg-matte-black/50 border border-neon-magenta/30 rounded-lg">
            <p className="text-white">{deployMessage}</p>
          </div>
        )}

        <button
          onClick={finalizeAndDeploy}
          disabled={isDeploying}
          className="px-8 py-4 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-300 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none text-lg font-header disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isDeploying ? (
            <>
              <span className="inline-block animate-spin mr-2">⚡</span>
              Deploying...
            </>
          ) : (
            "🚀 Finalize & Deploy Live"
          )}
        </button>
        <p className="text-xs text-white/50 mt-4">
          This will trigger GitHub Actions to rebuild and redeploy the site with your latest changes.
        </p>
      </div>

      {/* Site Links */}
      <div className="mt-12 text-center">
        <h3 className="text-lg font-header text-white/90 mb-4">Preview Links</h3>
        <div className="flex justify-center gap-4">
          <Link
            href="/preview"
            target="_blank"
            className="px-4 py-2 bg-acid-magenta text-white rounded hover:bg-electric-purple neon transition duration-200"
          >
            👀 Preview as Customer
          </Link>
        </div>
      </div>
    </div>
  );
}
