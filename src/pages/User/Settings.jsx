import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaCircleQuestion,
  FaGear,
  FaRightFromBracket,
  FaUser,
  FaXmark,
} from "react-icons/fa6";

export default function SettingsSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: FaBoxOpen, label: "My Plan", path: "/user/plan" },
    { icon: FaUser, label: "Edit Profile", path: "/user/edit-profile" },
    { icon: FaCircleQuestion, label: "Help", path: "/user/help" },
    { icon: FaRightFromBracket, label: "Logout", path: "/logout", danger: true },
  ];

  const handleMenuClick = (path) => {
    if (path === "/logout") {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAuthenticated");
      window.location.href = "/";
      return;
    }

    navigate(path);
    setIsOpen(false);
  };

  return (
    <div>
      {/* Settings button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
      >
        <FaGear className="w-6 h-6 text-[var(--color-text)]" />
      </button>

      {/* Sidebar */}
      {isOpen && (
        <div>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar panel */}
          <div className="fixed top-0 right-0 h-full w-3/4 sm:w-96 bg-white shadow-2xl border-l border-[var(--color-border)] z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-white">
              <h2 className="text-2xl font-bold text-[var(--color-text)]">Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-md transition-all"
              >
                <FaXmark className="w-6 h-6 text-[var(--color-text)]" />
              </button>
            </div>

            {/* Menu */}
            <div className="p-4">
              {menuItems.slice(0, -1).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item.path)}
                  className="w-full flex items-center gap-3 p-3 mb-1 transition-all hover:bg-gray-50 text-[var(--color-text)] group"
                >
                  <div className="p-2 rounded-md bg-[var(--color-primary-soft)] group-hover:bg-gray-100 transition-all">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-base font-medium">{item.label}</span>
                </button>
              ))}
              
              {/* Horizontal divider */}
              <div className="py-2">
                <div className="h-px bg-[var(--color-border)]"></div>
              </div>
              
              {/* Logout button */}
              <button
                onClick={() => handleMenuClick(menuItems[menuItems.length - 1].path)}
                className="w-full flex items-center gap-3 p-3 transition-all hover:bg-red-50 text-red-600 group"
              >
                <div className="p-2 rounded-md bg-red-100 group-hover:bg-red-200 transition-all">
                  <FaRightFromBracket className="w-5 h-5" />
                </div>
                <span className="text-base font-medium">Logout</span>
              </button>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[var(--color-border)] bg-white">
              <p className="text-[var(--color-text-muted)] text-sm text-center font-medium">
                Version 1.0.0
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
