"use client";

import { TwitchAuth } from "@src/components/auth/TwitchAuth";
import { StreamList } from "@src/components/streams/StreamList";
import { UserProfile } from "@src/components/streams/UserProfile";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { AlertCircle, LogOut, Twitch } from "lucide-react";
import { fetchUserProfile } from "@src/lib/api/twitch";

export function Popup() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    async function checkToken() {
      try {
        if (!browser?.storage) {
          throw new Error("Browser storage API not available");
        }

        const result = await browser.storage.local.get("twitchToken");
        if (result.twitchToken && typeof result.twitchToken === "string") {
          setAccessToken(result.twitchToken);
          // Fetch username when we have a token
          const profileData = await fetchUserProfile(result.twitchToken);
          if (profileData.data && profileData.data.length > 0) {
            setUsername(profileData.data[0].display_name);
          }
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
      setUsername(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[200px] grid place-items-center bg-base-200">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center gap-4 bg-base-200">
        <div className="alert alert-error">
          <AlertCircle className="h-6 w-6 stroke-current shrink-0" />
          <span>{error}</span>
        </div>
        <button
          onClick={() => setError(null)}
          className="btn btn-primary btn-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-[400px] max-h-[600px] overflow-y-auto bg-base-200">
      {!accessToken ? (
        <TwitchAuth onAuth={setAccessToken} />
      ) : (
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 bg-base-100 shadow-md">
            <div className="navbar px-4 py-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-8">
                      {username ? (
                        <span className="text-sm font-medium">
                          {username[0].toUpperCase()}
                        </span>
                      ) : (
                        <Twitch className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  <h1 className="text-lg font-semibold">
                    {username || 'Loading...'}
                  </h1>
                </div>
              </div>
              <div className="flex-none">
                <button 
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm gap-2 hover:bg-error/20 hover:text-error"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="p-4">
            <UserProfile 
              accessToken={accessToken}
              username={username}
              setUsername={setUsername}
            />
          </main>
        </div>
      )}
    </div>
  );
}
