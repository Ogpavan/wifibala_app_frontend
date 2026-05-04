import React from "react";

export default function Popup({ open, title, message, onClose, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="wifi-card mx-4 max-w-sm w-full p-6 text-center">
        {title && <h2 className="text-lg font-bold mb-2 text-[var(--color-text)]">{title}</h2>}
        <p className="wifi-muted mb-5">{message}</p>
        <div className="flex justify-center gap-2 flex-row-reverse">
          {actions ? (
            actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className={`w-full ${action.variant === "primary" ? "wifi-btn-primary" : "wifi-btn-secondary"}`}
              >
                {action.label}
              </button>
            ))
          ) : (
            <button
              onClick={onClose}
              className="wifi-btn-primary w-full"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
