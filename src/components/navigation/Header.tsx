import { LogIn, LogOut, Twitch } from "lucide-react";

type HeaderProps = {
  accessToken: string | null;
  username: string | null;
  isAuthLoading: boolean;
  isAuthenticating: boolean;
  streamsCount: number;
  handleLogin: () => void;
  handleLogout: () => void;
};

export function Header({
  accessToken,
  username,
  isAuthLoading,
  isAuthenticating,
  streamsCount,
  handleLogin,
  handleLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-base-100 shadow-md">
      <div className="navbar px-2 py-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="indicator">
              {accessToken && !isAuthLoading && streamsCount > 0 && (
                <span className="badge indicator-item badge-primary badge-xs">
                  {streamsCount}
                </span>
              )}
              <button className="btn btn-circle btn-ghost btn-sm">
                <Twitch className="h-4 w-4 text-primary" />
              </button>
            </div>
            <h1 className="text-lg font-semibold">
              {accessToken ? username || "Loading..." : "Twitch Live"}
            </h1>
          </div>
        </div>
        <div className="flex-none">
          {accessToken ? (
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm gap-1 hover:bg-error/20 hover:text-error"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              disabled={isAuthenticating}
              className="btn btn-primary btn-sm gap-1"
            >
              <LogIn className="h-4 w-4" />
              {isAuthenticating ? "Connecting..." : "Login"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
} 