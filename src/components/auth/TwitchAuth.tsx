"use client";

import { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import { TWITCH_CLIENT_ID } from '@src/lib/constants';

type TwitchAuthProps = {
  onAuth: (token: string) => void;
};

export function TwitchAuth({ onAuth }: TwitchAuthProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing token on component mount
    const checkStoredToken = async () => {
      try {
        const result = await browser.storage.local.get("twitchToken");
        if (result.twitchToken) {
          onAuth(result.twitchToken);
        }
      } catch (err) {
        console.error("Failed to retrieve token:", err);
      }
    };

    checkStoredToken();
  }, [onAuth]);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      // Generate a random state string for CSRF protection
      const state = Math.random().toString(36).substring(7);
      
      // Construct the authorization URL
      const authUrl = new URL("https://id.twitch.tv/oauth2/authorize");
      authUrl.searchParams.append("response_type", "token");
      authUrl.searchParams.append("client_id", TWITCH_CLIENT_ID);
      authUrl.searchParams.append("redirect_uri", "https://oauth.example.com/callback");
      authUrl.searchParams.append("scope", "user:read:follows user:read:email");
      authUrl.searchParams.append("state", state);
      authUrl.searchParams.append("force_verify", "true");

      console.log("Auth URL:", authUrl.toString());

      // Open auth window
      const authWindow = await browser.windows.create({
        url: authUrl.toString(),
        type: "popup",
        width: 800,
        height: 600
      });

      // Listen for the redirect in background script
      browser.webRequest.onBeforeRequest.addListener(
        async (details) => {
          try {
            const url = new URL(details.url);
            // Check for access token in the URL fragment
            if (url.hash) {
              const params = new URLSearchParams(url.hash.substring(1));
              const accessToken = params.get('access_token');
              const returnedState = params.get('state');
              
              // Verify state matches to prevent CSRF
              if (returnedState === state && accessToken) {
                console.log("Access Token:", accessToken);
                await browser.storage.local.set({ twitchToken: accessToken });
                onAuth(accessToken);
                
                // Close the auth window
                if (authWindow.id) {
                  await browser.windows.remove(authWindow.id);
                }
              } else {
                setError("Invalid state parameter returned");
              }
            }

            // Check for error in query parameters
            if (url.searchParams.has('error')) {
              const error = url.searchParams.get('error');
              const errorDescription = url.searchParams.get('error_description');
              setError(`${error}: ${errorDescription}`);
            }
          } catch (err) {
            console.error("Error processing redirect:", err);
          }
        },
        {
          urls: ["https://oauth.example.com/callback*"],
          types: ['main_frame']
        }
      );

    } catch (err) {
      console.error("Auth error:", err);
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={handleLogin}
        disabled={isAuthenticating}
        className="btn btn-primary"
      >
        {isAuthenticating ? "Connecting..." : "Connect with Twitch"}
      </button>

      {error && <div className="text-error text-sm">Error: {error}</div>}
    </div>
  );
}
