import { useEffect, useState } from "react";

export const useOfflineSync = () => {
  const [serverUp, setServerUp] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Use navigator.onLine

  const checkServer = async () => {
    if (!isOnline) return; // Skip if offline

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
        method: "GET",
        cache: "no-store",
      });
      setServerUp(res.ok);
    } catch (err) {
      setServerUp(false); // Only backend is down
    }
  };

  const syncQueue = async () => {
    if (!isOnline || !serverUp) return; // Only sync when both are up

    const queue = JSON.parse(localStorage.getItem("offlineQueue") || "[]");
    if (queue.length === 0) return;

    for (const req of queue) {
      try {
        await fetch(req.url, {
          method: req.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req.body),
        });
      } catch (err) {
        console.error("Sync failed (backend may be down):", err);
        return;
      }
    }
    localStorage.removeItem("offlineQueue");
  };

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check server periodically
  useEffect(() => {
    const interval = setInterval(checkServer, 3000);
    return () => clearInterval(interval);
  }, [isOnline]); // Re-run when internet status changes

  return { isOnline, serverUp, queueRequest, flushQueue: syncQueue };
};
  const queueRequest = (method: string, url: string, body: any) => {
    const queue = JSON.parse(localStorage.getItem("offlineQueue") || "[]");
    queue.push({ method, url, body });
    localStorage.setItem("offlineQueue", JSON.stringify(queue));
  };

  
