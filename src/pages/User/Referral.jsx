import React, { useEffect, useState } from "react";
import { FaArrowRight, FaCopy, FaGift, FaUserPlus } from "react-icons/fa6";

export default function ReferralPage() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.id;
  const userName = user.name || "";
  const userMobile = user.mobile || "";
  const userEmail = user.email || "";
  const userAddress = user.address || "";
  const userWallet = user.wallet || 0;
  const userReferralCode = user.referral_code;
  const [referralCode, setReferralCode] = useState(userReferralCode || "");
  const [loading, setLoading] = useState(!userReferralCode);
  const [copyState, setCopyState] = useState("idle");

  useEffect(() => {
    const loadReferral = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/referrals/user/${userId}`,
        );
        const data = await response.json();
        if (data.success && data.referral_code) {
          setReferralCode(data.referral_code);
          const nextUser = {
            id: userId,
            name: userName,
            mobile: userMobile,
            email: userEmail,
            address: userAddress,
            wallet: userWallet,
            referral_code: data.referral_code,
          };
          localStorage.setItem("user", JSON.stringify(nextUser));
        } else if (userReferralCode) {
          setReferralCode(userReferralCode);
        }
      } catch (error) {
        console.error("Failed to load referral info:", error);
        setReferralCode(userReferralCode || "INVITE1");
      } finally {
        setLoading(false);
      }
    };

    loadReferral();
  }, [userId, userReferralCode, userAddress, userEmail, userMobile, userName, userWallet]);

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      return copied;
    } catch (error) {
      console.error("Failed to copy referral text:", error);
      return false;
    }
  };

  const handleCopyCode = async () => {
    const copied = await copyToClipboard(referralCode || "INVITE1");
    setCopyState(copied ? "code" : "error");
    if (copied) {
      window.setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  return (
    <div className="wifi-page pb-24">
      <div className="wifi-hero wifi-hero-primary px-6 py-6 rounded-b-[28px] text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/15 flex items-center justify-center">
          <FaUserPlus className="text-white text-2xl" />
        </div>
        <h1 className="wifi-page-title text-xl font-bold mb-1">Referral</h1>
        <p className="wifi-hero-subtitle text-xs">Invite friends and share your connection</p>
      </div>

      <div className="px-6 py-6 max-w-lg mx-auto space-y-4">
        <div className="wifi-card p-5">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FaGift className="text-[var(--color-primary)]" />
            <h2 className="text-base font-bold text-[var(--color-text)]">Your Referral Code</h2>
          </div>
          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-primary-soft)]/40 px-4 py-4 mb-3 text-center">
            <p className="text-2xl font-bold tracking-[0.35em] text-[var(--color-primary)]">
              {loading ? "------" : referralCode || "INVITE1"}
            </p>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Share your referral code with friends so they can sign up using your referral.
          </p>
          <button
            type="button"
            onClick={handleCopyCode}
            className="wifi-btn w-full inline-flex items-center justify-center gap-2"
          >
            <FaCopy />
            {copyState === "code" ? "Code Copied" : "Copy Referral Code"}
          </button>
        </div>

        <div className="wifi-card p-5">
          <h3 className="text-base font-bold text-[var(--color-text)] mb-2">
            How it works
          </h3>
          <div className="space-y-3 text-sm text-[var(--color-text-muted)]">
            <p>1. Copy your referral code.</p>
            <p>2. Share it with your friends.</p>
            <p>3. Earn rewards when they sign up.</p>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="mt-4 text-sm font-semibold text-[var(--color-primary)] inline-flex items-center gap-1"
          >
            Copy again
            <FaArrowRight className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
