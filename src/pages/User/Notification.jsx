import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCheckCircle,
  faExclamationTriangle,
  faGift,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";

const notifications = [
  {
    id: 1,
    type: "offer",
    icon: faGift,
    title: "20% Off First Recharge",
    message:
      "Get 20% instant discount on your first recharge. Use code FIRST20.",
    time: "2 hours ago",
    color: "var(--color-purple)",
  },
  {
    id: 2,
    type: "plan",
    icon: faWifi,
    title: "Plan Expiry Reminder",
    message:
      "Your Standard Plan will expire on 30 Sep 2025. Renew now to continue uninterrupted service.",
    time: "1 day ago",
    color: "var(--color-indigo)",
  },
  {
    id: 3,
    type: "success",
    icon: faCheckCircle,
    title: "Recharge Successful",
    message: "Your wallet has been recharged with ₹500. Thank you!",
    time: "3 days ago",
    color: "var(--color-emerald)",
  },
  {
    id: 4,
    type: "alert",
    icon: faExclamationTriangle,
    title: "Service Alert",
    message:
      "Scheduled maintenance on 5th Oct, 2AM-4AM. Internet may be unavailable.",
    time: "5 days ago",
    color: "var(--color-warning)",
  },
];

export default function Notification() {
  return (
    <div className="wifi-page pb-24">
      <div className="wifi-hero wifi-hero-primary px-4 pt-6 pb-10 rounded-b-[28px]">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faBell}
              className="text-2xl text-white"
            />
            <h1 className="wifi-page-title text-2xl font-bold">
              Notifications
            </h1>
          </div>
          <p className="wifi-hero-subtitle text-sm mt-2">Recent updates and alerts</p>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="flex flex-col gap-4">
          {notifications.length === 0 && (
            <div className="text-center text-[var(--color-text-muted)] py-10">
              No notifications yet.
            </div>
          )}
          {notifications.map((n) => (
            <div
              key={n.id}
              className="wifi-card flex items-start gap-4 p-4"
            >
              <div
                className="w-12 h-12 flex items-center justify-center rounded-md"
                style={{ backgroundColor: `${n.color}15` }}
              >
                <FontAwesomeIcon
                  icon={n.icon}
                  className="text-xl"
                  style={{ color: n.color }}
                />
              </div>
              <div className="flex-1">
                <h3
                  className="font-semibold mb-1"
                  style={{ color: "var(--color-text)" }}
                >
                  {n.title}
                </h3>
                <p
                  className="text-sm mb-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {n.message}
                </p>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {n.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
