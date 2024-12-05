import { useEffect, useState } from "react";
import { fetchUserProfile } from "@src/lib/api/twitch";
import { FollowedChannels } from "@src/components/streams/FollowedChannels";
import { UserProfileInfo } from "./UserProfileInfo";
import { FollowedChannelsSection } from "./FollowedChannelsSection";

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
      <UserProfileInfo username={username} />
      {userId && <FollowedChannelsSection accessToken={accessToken} userId={userId} />}
    </div>
  );
}
