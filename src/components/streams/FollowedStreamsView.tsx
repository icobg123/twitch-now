import { LiveFollowedStreams } from "@src/components/streams/LiveFollowedStreams";
import { AlertCircle } from "lucide-react";
import { useUserProfile } from "@src/hooks/useUserProfile";

type FollowedStreamsViewProps = {
  accessToken: string;
  username: string | null;
};

export function FollowedStreamsView({
  accessToken,
  username,
}: FollowedStreamsViewProps) {
  const { userId, isLoading, error } = useUserProfile(accessToken);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
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
    <div className="flex flex-col">
      {/* Debug info */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-6 text-xs text-base-content/50">
          Debug: UserID: {userId || "not set"}, Username:{" "}
          {username || "not set"}
        </div>
      )}

      {/* Live Streams Card */}
      <div className="card mb-6 bg-base-100 shadow-xl">
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
