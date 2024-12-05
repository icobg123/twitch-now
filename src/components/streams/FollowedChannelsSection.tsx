import { FollowedChannels } from "@src/components/streams/FollowedChannels";

type FollowedChannelsSectionProps = {
  accessToken: string;
  userId: string;
};

export function FollowedChannelsSection({ accessToken, userId }: FollowedChannelsSectionProps) {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Followed Channels</h2>
      <FollowedChannels accessToken={accessToken} userId={userId} />
    </div>
  );
} 