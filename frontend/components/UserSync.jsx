// frontend/components/UserSync.jsx

import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useRef } from "react";

export default function UserSync() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const hasSynced = useRef(false);

  useEffect(() => {
    // console.log("UserSync effect triggered");
    // console.log("isLoaded:", isLoaded);
    // console.log("isSignedIn:", isSignedIn);
    // console.log("hasSynced:", hasSynced.current);

    const syncUser = async () => {
      if (!isLoaded || !isSignedIn || hasSynced.current) {
        console.log("Sync skipped");
        return;
      }

      try {
        // const token = await getToken({ template: "default" });
        const token = await getToken();
        if (!token) return;

        // Test API
        // console.log("CLERK JWT:", token);
        console.log("HIIIIII:    ", process.env.EXPO_PUBLIC_API_URL);
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/user/sync`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        // console.log("fetchinggggg");
        if (res.ok) {
          hasSynced.current = true;
          console.log("✅ User synced ");
        } else {
          console.log("❌ Sync failed:", await res.text());
        }
      } catch (err) {
        console.error("Sync error:", err);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn]);

  return null;
}
