import { useState, useEffect } from "react";
import { fetchUserProfile } from "@src/lib/api/twitch";

type UseUserProfileReturn = {
  userId: string | null;
  isLoading: boolean;
  error: string | null;
};

export function useUserProfile(accessToken: string): UseUserProfileReturn {
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserProfile() {
      setIsLoading(true);
      try {
        const profileData = await fetchUserProfile(accessToken);

        if (profileData.data && profileData.data.length > 0) {
          const user = profileData.data[0];
          setUserId(user.id);
        } else {
          throw new Error("No user data received");
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserProfile();
  }, [accessToken]);

  return { userId, isLoading, error };
} 