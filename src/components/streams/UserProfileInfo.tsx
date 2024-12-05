type UserProfileInfoProps = {
  username: string | null;
};

export function UserProfileInfo({ username }: UserProfileInfoProps) {
  return (
    <div className="text-sm">
      {username ? `Logged in as: ${username}` : "Loading user profile..."}
    </div>
  );
} 