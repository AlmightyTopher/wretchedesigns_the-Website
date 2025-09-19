"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session } = useSession();

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

      {/* Site Links */}
      <div className="mt-12 text-center">
        <h3 className="text-lg font-header text-white/90 mb-4">Quick Links</h3>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 border border-acid-magenta text-acid-magenta rounded hover:bg-acid-magenta/20 neon transition duration-200"
          >
            View Live Site
          </Link>
          <Link
            href="/gallery"
            target="_blank"
            className="px-4 py-2 border border-acid-magenta text-acid-magenta rounded hover:bg-acid-magenta/20 neon transition duration-200"
          >
            View Gallery
          </Link>
          <Link
            href="/shop"
            target="_blank"
            className="px-4 py-2 border border-acid-magenta text-acid-magenta rounded hover:bg-acid-magenta/20 neon transition duration-200"
          >
            View Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
