import { useEffect, useState } from "react";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [showLedgerHistory, setShowLedgerHistory] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/referrals/user/${user.id}/rewards`,
        );
        const data = await res.json();
        if (data.success) {
          setBalance(Number(data.balance || 0));
          setRewards(Array.isArray(data.rewards) ? data.rewards : []);
        }
      } catch (error) {
        console.error("Failed to load wallet data:", error);
      }
    };

    fetchWalletData();
    const timer = window.setInterval(fetchWalletData, 15000);
    return () => window.clearInterval(timer);
  }, [user?.id]);

  return (
    <div className="wifi-page p-4 pb-24">
      <div className="wifi-card p-5 max-w-md mx-auto text-center mb-4">
        <p className="text-sm text-[var(--color-text-muted)] mb-2">Wallet Balance</p>
        <h1 className="text-4xl font-bold text-[var(--color-primary)]">₹{balance.toFixed(2)}</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-2">
          This updates automatically when your referral reward is credited.
        </p>
      </div>

      <div className="wifi-card p-5 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setShowLedgerHistory((prev) => !prev)}
          className="w-full flex items-center justify-between text-left"
        >
          <h2 className="text-base font-bold text-[var(--color-text)]">
            Ledger History
          </h2>
          <span className="text-xs font-semibold text-[var(--color-primary)]">
            {showLedgerHistory ? "Hide" : "Show"}
          </span>
        </button>

        {showLedgerHistory ? (
          <div className="mt-3 space-y-3">
            {rewards.length ? (
              rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-primary-soft)]/30 px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      Referral reward credited
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {reward.referred_name || "New signup"} •{" "}
                      {reward.created_at ? new Date(reward.created_at).toLocaleString() : "-"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">
                      +₹{Number(reward.reward_amount || 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">
                      Code {reward.referral_code || "-"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">
                No referral rewards yet.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
