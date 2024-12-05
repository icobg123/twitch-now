import { useEffect, useState } from "react";
import { fetchUserProfile } from "@src/lib/api/twitch";
import { FollowedChannels } from "@src/components/streams/FollowedChannels";

type UserProfileProps = {
  accessToken: string;
};

export function UserProfile({ accessToken }: UserProfileProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const profileData = await fetchUserProfile(accessToken);
        console.log('Profile data:', profileData);
        
        if (profileData.data && profileData.data.length > 0) {
          const user = profileData.data[0];
          setUsername(user.display_name);
          setUserId(user.id);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
        setError("Failed to load user profile");
      }
    }

    loadUserProfile();
  }, [accessToken]);

  if (error) {
    return <div className="text-error text-sm">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm">
        {username ? `Logged in as: ${username}` : "Loading user profile..."}
      </div>
      
      {userId && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Followed Channels</h2>
          <FollowedChannels accessToken={accessToken} userId={userId} />
        </div>
      )}
    </div>
  );
}
