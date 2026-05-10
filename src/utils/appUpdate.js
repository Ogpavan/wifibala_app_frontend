export const APP_BUILD_META = {
  version: __APP_VERSION__,
  buildTime: __APP_BUILD_TIME__,
};

async function fetchLatestBuildMeta() {
  const response = await fetch(`/version.json?ts=${Date.now()}`, {
    cache: "no-store",
    headers: {
      "cache-control": "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch build metadata: ${response.status}`);
  }

  return response.json();
}

async function clearRuntimeCaches() {
  if ("caches" in window) {
    const cacheKeys = await window.caches.keys();
    await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
  }
}

async function refreshServiceWorkers() {
  if (!("serviceWorker" in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.update()));
}

export function setupAppUpdateChecks(triggerUpdate) {
  const maybeUpdate = async () => {
    try {
      const latest = await fetchLatestBuildMeta();
      const hasNewBuild =
        latest?.version !== APP_BUILD_META.version ||
        latest?.buildTime !== APP_BUILD_META.buildTime;

      if (!hasNewBuild) return;

      await refreshServiceWorkers();
      await clearRuntimeCaches();

      if (typeof triggerUpdate === "function") {
        await triggerUpdate(true);
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("App update check failed:", error);
    }
  };

  const intervalId = window.setInterval(maybeUpdate, 60 * 1000);
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      void maybeUpdate();
    }
  };

  window.addEventListener("focus", maybeUpdate);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  void maybeUpdate();

  return () => {
    window.clearInterval(intervalId);
    window.removeEventListener("focus", maybeUpdate);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}
