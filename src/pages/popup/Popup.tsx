"use client";

import { TwitchAuth } from "@src/components/auth/TwitchAuth";
import { StreamList } from "@src/components/streams/StreamList";
import { UserProfile } from "@src/components/streams/UserProfile";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

export function Popup() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkToken() {
      try {
        console.log("Browser object:", browser);
        console.log("Storage API:", browser.storage);

        if (!browser?.storage) {
          throw new Error("Browser storage API not available");
        }

        const result = await browser.storage.local.get("twitchToken");
        if (result.twitchToken && typeof result.twitchToken === "string") {
          setAccessToken(result.twitchToken);
        }
      } catch (err) {
        setError("Failed to load saved token");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    checkToken();
  }, []);

  const handleLogout = async () => {
    try {
      if (!browser?.storage) {
        throw new Error("Browser storage API not available");
      }
      await browser.storage.local.remove("twitchToken");
      setAccessToken(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="loading loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-error">
        <p>{error}</p>
        <button
          onClick={() => setError(null)}
          className="btn btn-sm btn-outline mt-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 min-w-[400px] max-h-[600px] overflow-y-auto">
      {!accessToken ? (
        <TwitchAuth onAuth={setAccessToken} />
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={handleLogout} className="btn btn-sm btn-ghost">
              Logout
            </button>
          </div>
          <UserProfile accessToken={accessToken} />
        </div>
      )}
    </div>
  );
}
