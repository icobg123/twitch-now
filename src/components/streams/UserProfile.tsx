import { useEffect, useState } from "react";
import { fetchUserProfile } from "@src/lib/api/twitch";
import { FollowedChannelsSection } from "./FollowedChannelsSection";
import { UserProfileInfo } from "@src/components/streams/UserProfileInfo";
import { AlertCircle } from "lucide-react";
import {FollowedChannels} from "@src/components/streams/FollowedChannels";

type UserProfileProps = {
  accessToken: string;
  username: string | null;
  setUsername: (username: string | null) => void;
};

export function UserProfile({ accessToken, username, setUsername }: UserProfileProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserProfile() {
      setIsLoading(true);
      try {
        const profileData = await fetchUserProfile(accessToken);
        console.log('Profile Data:', profileData); // Debug log

        if (profileData.data && profileData.data.length > 0) {
          const user = profileData.data[0];
          setUsername(user.display_name);
          setUserId(user.id);
          console.log('Set User ID:', user.id); // Debug log
        } else {
          throw new Error('No user data received');
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserProfile();
  }, [accessToken, setUsername]);

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
        <AlertCircle className="h-6 w-6 stroke-current shrink-0" />
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-base-content/50">
          Debug: UserID: {userId || 'not set'}
        </div>
      )}

      {/* Followed Channels Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-4">
          <h2 className="card-title text-lg mb-4">Followed Channels</h2>
          {userId ? (
              <FollowedChannels accessToken={accessToken} userId={userId} />
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
