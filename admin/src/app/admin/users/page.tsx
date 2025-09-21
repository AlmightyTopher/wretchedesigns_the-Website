"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin: string;
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  // Load users from API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    setError("");
    if (!newUser.name || !newUser.email) {
      setError("Please fill out all required fields");
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add user');
      }

      // Reset form and reload users
      setNewUser({ name: "", email: "", role: "user", password: "" });
      setShowAddForm(false);
      loadUsers(); // Reload users list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user");
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (confirm("Are you sure you want to remove this user?")) {
      try {
        const response = await fetch(`/api/users?id=${userId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to remove user');
        }

        loadUsers(); // Reload users list
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove user");
      }
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          role: newRole,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user role');
      }

      loadUsers(); // Reload users list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user role");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-electric-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="glitch text-3xl neon" style={{ color: "#3A7CA5" }}>
          User Manager
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-2 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none"
        >
          Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-[#181825] rounded-lg shadow-neon p-6 border border-neon-magenta/20">
          <h2 className="text-xl font-header text-acid-magenta mb-4">
            Add New User
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Full Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                placeholder="User's full name"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                placeholder="Secure password"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                aria-label="New user role"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleAddUser}
              disabled={!newUser.name || !newUser.email || !newUser.password}
              className="px-6 py-2 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add User
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 border border-acid-magenta text-acid-magenta rounded hover:bg-acid-magenta/20 neon transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[#181825] rounded-lg shadow-neon border border-neon-magenta/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-header text-acid-magenta">Name</th>
                <th className="px-6 py-4 text-left text-sm font-header text-acid-magenta">Email</th>
                <th className="px-6 py-4 text-left text-sm font-header text-acid-magenta">Role</th>
                <th className="px-6 py-4 text-left text-sm font-header text-acid-magenta">Created</th>
                <th className="px-6 py-4 text-left text-sm font-header text-acid-magenta">Last Login</th>
                <th className="px-6 py-4 text-left text-sm font-header text-acid-magenta">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neon-magenta/20">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-black/20">
                  <td className="px-6 py-4 text-white whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 text-white/80 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-electric-purple text-white'
                          : 'bg-gray-600 text-white'
                      }`}
                      disabled={user.id === '1'} // Prevent changing the first user's role (admin)
                      aria-label={`Role for ${user.name}`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-white/70 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-white/70 whitespace-nowrap">
                    {user.lastLogin === 'Never'
                      ? 'Never'
                      : new Date(user.lastLogin).toLocaleDateString()
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {user.id !== '1' && ( // Prevent removing the first user
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs transition duration-200 hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">No users found.</p>
          <p className="text-white/50">Click "Add User" to get started.</p>
        </div>
      )}

      <div className="bg-[#181825] rounded-lg shadow-neon p-6 border border-neon-magenta/20">
        <h3 className="text-lg font-header text-acid-magenta mb-3">User Management Notes</h3>
        <ul className="text-white/70 text-sm space-y-1">
          <li>• Current system uses mock data - integrate with your authentication provider</li>
          <li>• Admin users have full access to all features</li>
          <li>• Regular users have limited access based on your requirements</li>
          <li>• Password security: Implement proper hashing in your production system</li>
        </ul>
      </div>
    </div>
  );
}
