import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLocationDot,
  FaPhone,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";

const APP_VERSION = __APP_VERSION__;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser({
          name: parsedUser.name || "User Name",
          email: parsedUser.email || "user@email.com",
          phone: parsedUser.mobile || "+91 00000 00000",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedUser.name || "User")}&background=1e3a8a&color=fff&size=200`,
          joined: "Jan 2024", // Default since not in localStorage
          address: parsedUser.address || "Address not provided",
        });
      } else {
        // Fallback user data if localStorage is empty
        setUser({
          name: "Guest User",
          email: "guest@email.com",
          phone: "+91 00000 00000",
          avatar:
            "https://ui-avatars.com/api/?name=Guest+User&background=1e3a8a&color=fff&size=200",
          joined: "Jan 2024",
          address: "Address not provided",
        });
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      // Set fallback user data
      setUser({
        name: "Guest User",
        email: "guest@email.com",
        phone: "+91 00000 00000",
        avatar:
          "https://ui-avatars.com/api/?name=Guest+User&background=1e3a8a&color=fff&size=200",
        joined: "Jan 2024",
        address: "Address not provided",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuthenticated");

    // Redirect to home/login page
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="wifi-page flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[var(--color-primary-soft)] border-t-[var(--color-primary)] rounded-full animate-spin mb-3"></div>
          <p className="text-[var(--color-text-muted)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="wifi-page flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--color-text-muted)]">Unable to load profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wifi-page">
      {/* Header */}
      <div className="wifi-hero wifi-hero-primary px-6 py-5 rounded-b-[28px]">
        <h1 className="wifi-page-title text-xl font-bold">Profile</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-28 h-28 rounded-3xl shadow-lg"
            />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-1">{user.name}</h2>
          <p className="text-[var(--color-text-muted)] text-sm mb-1">{user.email}</p>
          <p className="text-[var(--color-text-muted)] text-xs">Member since {user.joined}</p>
        </div>

        {/* Personal Details */}
        <div className="wifi-card p-6">
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">
            Personal Details
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--color-primary-soft)] rounded-md">
                <FaUser className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Full Name</p>
                <p className="text-[var(--color-text)] font-medium">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--color-primary-soft)] rounded-md">
                <FaEnvelope className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Email Address</p>
                <p className="text-[var(--color-text)] font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--color-primary-soft)] rounded-md">
                <FaPhone className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Phone Number</p>
                <p className="text-[var(--color-text)] font-medium">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--color-primary-soft)] rounded-md">
                <FaLocationDot className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Address</p>
                <p className="text-[var(--color-text)] font-medium">{user.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="wifi-btn-danger w-full"
          >
            <FaRightFromBracket className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            wifibala v{APP_VERSION}
          </p>
        </div>
      </div>
    </div>
  );
}
