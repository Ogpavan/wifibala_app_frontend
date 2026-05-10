import React from 'react';
import { FaBell } from "react-icons/fa6";

function Navbar() {
  return (
    <div
      className="wifi-card mx-3 mt-3 px-4 py-3 flex items-center justify-between"
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.75rem)",
      }}
    >
      
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-md bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xl shadow-md">
          W
        </div>
        <span className="text-lg font-semibold text-[var(--color-text)]">
          wifibala
        </span>
      </div>

      {/* Right: Notification */}
      <div className="relative">
        <FaBell className="w-6 h-6 text-[var(--color-text-muted)]" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--color-error)] rounded-full border-2 border-white"></div>
      </div>
    </div>
  );
}

export default Navbar;
