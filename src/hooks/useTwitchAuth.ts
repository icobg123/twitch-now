import { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import { TWITCH_CLIENT_ID } from "@src/lib/constants";
import { fetchUserProfile } from "@src/lib/api/twitch";

const USER_CACHE_KEY = "twitch-user-cache";
const USER_CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds

type UserCacheData = {
  username: string;
  userId: string;
  timestamp: number;
};

function getUserCache(): UserCacheData | null {
  try {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (!cached) return null;

    const data = JSON.parse(cached) as UserCacheData;
    const isExpired = Date.now() - data.timestamp > USER_CACHE_EXPIRY;

    return isExpired ? null : data;
  } catch {
    return null;
  }
}

function setUserCache(username: string, userId: string) {
  try {
    const cacheData: UserCacheData = {
      username,
      userId,
      timestamp: Date.now(),
    };
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Failed to cache user data:", error);
  }
}

export function useTwitchAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    checkToken();
  }, []);

  async function checkToken() {
    try {
      if (!browser?.storage) {
        throw new Error("Browser storage API not available");
      }

      const result = await browser.storage.local.get("twitchToken");
      if (result.twitchToken && typeof result.twitchToken === "string") {
        setAccessToken(result.twitchToken);
        
        // Try to get user data from cache first
        const cachedUser = getUserCache();
        if (cachedUser) {
          setUsername(cachedUser.username);
          setUserId(cachedUser.userId);
        } else {
          // Fetch from API if cache miss or expired
          const profileData = await fetchUserProfile(result.twitchToken);
          if (profileData.data && profileData.data.length > 0) {
            const user = profileData.data[0];
            setUsername(user.display_name);
            setUserId(user.id);
            setUserCache(user.display_name, user.id);
          }
        }
      }
    } catch (err) {
      setError("Failed to load saved token");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogin = async () => {
    setIsAuthenticating(true);
    setError(null);

    let authWindowId: number | undefined;
    let listener: any;

    try {
      const state = Math.random().toString(36).substring(7);
      const authUrl = new URL("https://id.twitch.tv/oauth2/authorize");
      authUrl.searchParams.append("response_type", "token");
      authUrl.searchParams.append("client_id", TWITCH_CLIENT_ID);
      authUrl.searchParams.append(
        "redirect_uri",
        "https://oauth.example.com/callback"
      );
      authUrl.searchParams.append("scope", "user:read:follows user:read:email");
      authUrl.searchParams.append("state", state);
      authUrl.searchParams.append("force_verify", "true");

      const authWindow = await browser.windows.create({
        url: authUrl.toString(),
        type: "popup",
        width: 800,
        height: 600,
      });

      authWindowId = authWindow.id;

      listener = async (details: any) => {
        try {
          const url = new URL(details.url);
          if (url.hash) {
            const params = new URLSearchParams(url.hash.substring(1));
            const accessToken = params.get("access_token");
            const returnedState = params.get("state");

            if (returnedState === state && accessToken) {
              browser.webRequest.onBeforeRequest.removeListener(listener);
              
              if (authWindowId) {
                try {
                  await browser.windows.remove(authWindowId);
                } catch (windowErr) {
                  console.error("Error closing window:", windowErr);
                }
              }

              await browser.storage.local.set({ twitchToken: accessToken });
              setAccessToken(accessToken);

              const profileData = await fetchUserProfile(accessToken);
              if (profileData.data && profileData.data.length > 0) {
                const user = profileData.data[0];
                setUsername(user.display_name);
                setUserId(user.id);
                setUserCache(user.display_name, user.id);
              }
            } else {
              setError("Invalid state parameter returned");
            }
          }
        } catch (err) {
          console.error("Error processing redirect:", err);
          setError("Authentication failed");
        } finally {
          setIsAuthenticating(false);
        }

        return { cancel: false };
      };

      browser.webRequest.onBeforeRequest.addListener(
        listener,
        {
          urls: ["https://oauth.example.com/callback*"],
          types: ["main_frame"],
        },
        ["blocking"]
      );

    } catch (err) {
      console.error("Auth error:", err);
      setError(err instanceof Error ? err.message : "Authentication failed");
      setIsAuthenticating(false);

      if (listener) {
        browser.webRequest.onBeforeRequest.removeListener(listener);
      }
      if (authWindowId) {
        try {
          await browser.windows.remove(authWindowId);
        } catch (windowErr) {
          console.error("Error closing window:", windowErr);
        }
      }
    }
  };

  const handleLogout = async () => {
    try {
      if (!browser?.storage) {
        throw new Error("Browser storage API not available");
      }
      await browser.storage.local.remove("twitchToken");
      localStorage.removeItem(USER_CACHE_KEY);
      setAccessToken(null);
      setUsername(null);
      setUserId(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return {
    accessToken,
    username,
    userId,
    isLoading,
    error,
    isAuthenticating,
    handleLogin,
    handleLogout,
    setError,
  };
} 