import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faUserPlus,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FaWhatsapp } from "react-icons/fa";

import Ring from "./Portchange";
import Carousel from "./Carousel";
import Table from "./Table";
import {
  cacheAppSettings,
  fetchAppSettings,
  getTelHref,
  getWhatsAppHref,
  readCachedAppSettings,
} from "../../utils/settings";

export default function Home() {
  const [activeCard, setActiveCard] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [contactSettings, setContactSettings] = useState(() => readCachedAppSettings());
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "User";

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${BASE_URL}/api/auth/wallet/${user.id}`);
        const data = await res.json();
        if (data.success) {
          setWalletBalance(data.wallet.wallet || 0);
        }
      } catch (err) {
        console.error("Failed to fetch wallet balance:", err);
      }
    };

    if (user?.id) {
      fetchWalletBalance();
      const timer = window.setInterval(fetchWalletBalance, 15000);
      return () => window.clearInterval(timer);
    }
  }, [user?.id]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = cacheAppSettings(
          await fetchAppSettings(import.meta.env.VITE_API_BASE_URL),
        );
        setContactSettings(settings);
      } catch (error) {
        console.error("Failed to load contact settings:", error);
      }
    };

    loadSettings();
  }, []);

  const cards = [
    {
      id: 3,
      title: "Referral",
      value: "Invite & Earn",
      subtitle: "Share with Friends",
      icon: faUserPlus,
      gradient: "from-[var(--color-primary)] to-[var(--color-accent)]",
      iconBg: "bg-[var(--color-primary-soft)]",
      iconColor: "text-[var(--color-primary)]",
    },
    {
      id: 4,
      title: "Wallet",
      value: `₹${walletBalance}`,
      subtitle: "Available Balance",
      icon: faWallet,
      gradient: "from-[var(--color-primary)] to-[var(--color-accent)]",
      iconBg: "bg-[var(--color-primary-soft)]",
      iconColor: "text-[var(--color-primary)]",
    },
  ];

  const callHref = getTelHref(contactSettings.primary_number);
  const whatsappHref =
    getWhatsAppHref(contactSettings.whatsapp_number) ||
    getWhatsAppHref(contactSettings.primary_number);
  const displayPhone = contactSettings.primary_number || "+91 76681 29807";
  const displayWhatsApp =
    contactSettings.whatsapp_number ||
    contactSettings.primary_number ||
    "+91 76681 29807";

  return (
    <div className="wifi-page bg-white">
      {/* Header */}
      <div className="wifi-hero wifi-hero-primary px-4 pt-4 pb-16 rounded-b-[28px]">
        <div className="flex items-start justify-between mb-2">
          {/* User */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => (window.location.href = "/user/profile")}
              className="w-10 h-10 rounded-md bg-[var(--color-primary-soft)] flex items-center justify-center text-[var(--color-primary)] font-semibold border border-[var(--color-border)]"
            >
              {userName[0]}
            </button>
            <div>
              <p className="text-white/80 text-xs">Welcome back!</p>
              <h1 className="wifi-page-title text-base font-semibold">
                Hey, {userName}
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <a
              href={callHref || "tel:+917668129807"}
              title={displayPhone}
              className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80 transition"
            >
              <FontAwesomeIcon icon={faPhone} className="h-4 w-4" />
              {displayPhone}
            </a>
            <a
              href={whatsappHref || "https://wa.me/917668129807"}
              target="_blank"
              rel="noopener noreferrer"
              title={displayWhatsApp}
              className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80 transition"
            >
              <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
              {displayWhatsApp}
            </a>
          </div>



        </div>

        {/* Date */}
        <p className="text-white/80 text-xs mt-1 text-center">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Cards */}
      <div className="px-3 -mt-10 pb-6">
        <div className="grid grid-cols-2 gap-2">
          {cards.map((card) => {
            return (
              <div
                key={card.id}
                onClick={() => {
                  setActiveCard(card.id);
                  if (card.id === 3) {
                    navigate("/user/referral");
                  } else if (card.id === 4) {
                    navigate("/user/wallet");
                  }
                }}
                className={`wifi-card p-4 transition-all cursor-pointer ${activeCard === card.id
                    ? "scale-105 shadow-xl"
                    : "hover:scale-102"
                  }`}
              >
                <div className="flex items-start justify-between gap-3 h-full">
                  <div>
                    <div
                    className={`${card.iconBg} w-10 h-10 rounded-md flex items-center justify-center mb-2`}
                  >
                    <FontAwesomeIcon icon={card.icon} className={`h-4 w-4 ${card.iconColor}`} />
                  </div>

                  <p className="text-[var(--color-text-muted)] text-xs font-medium">
                    {card.title}
                  </p>
                  </div>

                  <div className="text-right">
                    <h3
                      className={`text-xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent leading-tight`}
                    >
                      {card.value}
                    </h3>
                    <p className="text-[var(--color-text-muted)] text-xs mt-1">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Ring />
      <Carousel />
      <Table />
    </div>
  );
}
