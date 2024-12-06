import { useEffect, useState } from "react";
import { fetchUserProfile } from "@src/lib/api/twitch";
import { LiveFollowedStreams } from "@src/components/streams/LiveFollowedStreams";
import { AlertCircle } from "lucide-react";

type UserProfileProps = {
  accessToken: string;
  username: string | null;
};

export function UserProfile({ accessToken, username }: UserProfileProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserProfile() {
      setIsLoading(true);
      try {
        const profileData = await fetchUserProfile(accessToken);
        console.log("Profile Data:", profileData); // Debug log

        if (profileData.data && profileData.data.length > 0) {
          const user = profileData.data[0];
          setUserId(user.id);
          console.log("Set User ID:", user.id); // Debug log
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="loading loading-spinner loading-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <AlertCircle className="h-6 w-6 shrink-0 stroke-current" />
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug info */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-base-content/50">
          Debug: UserID: {userId || "not set"}, Username:{" "}
          {username || "not set"}
        </div>
      )}

      {/* Live Streams Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          {userId ? (
            <LiveFollowedStreams accessToken={accessToken} userId={userId} />
          ) : (
            <div className="alert alert-warning">
              <AlertCircle className="h-5 w-5" />
              <span>Unable to load user ID</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
