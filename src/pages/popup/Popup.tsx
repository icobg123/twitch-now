"use client";

import {AlertCircle, LogIn, LogOut, Twitch, ArrowUpDown, Gamepad, Users, Star} from "lucide-react";
import {useTwitchAuth} from "@src/hooks/useTwitchAuth";
import {FollowedStreamsView} from "@src/components/streams/FollowedStreamsView";
import {useFollowedLiveStreams} from "@src/hooks/useFollowedLiveStreams";
import {useStreamFilters} from "@src/hooks/useStreamFilters";

export function Popup() {
  const {
    accessToken,
    username,
    userId,
    isLoading: isAuthLoading,
    error,
    isAuthenticating,
    handleLogin,
    handleLogout,
    setError,
  } = useTwitchAuth();

  console.log('🔑 Auth state:', { 
    hasAccessToken: !!accessToken, 
    username, 
    userId, 
    isAuthLoading 
  });

  const { data, isLoading: isLoadingStreams } = useFollowedLiveStreams(
    accessToken ?? "",
    userId ?? "",
    !accessToken || !userId
  );

  const {
    sortBy,
    filterBy,
    setSortBy,
    setFilterBy,
    filteredStreams
  } = useStreamFilters(data?.streams ?? []);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 bg-base-200 p-6">
        <div className="alert alert-error">
          <AlertCircle className="h-6 w-6 shrink-0 stroke-current" />
          <span>{error}</span>
        </div>
        <button
          onClick={() => setError(null)}
          className="btn btn-primary btn-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] w-[400px] flex-col bg-base-200">
      <header className="sticky top-0 z-10 bg-base-100 shadow-md">
        <div className="navbar px-2 py-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="indicator">
                {accessToken && !isAuthLoading && filteredStreams.length > 0 && (
                  <span className="badge indicator-item badge-primary badge-xs">
                    {filteredStreams.length}
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
      <main className="flex-1 overflow-y-auto p-0 pb-16 relative">
        {!accessToken ? (
          <div className="flex h-full items-center justify-center px-4">
            <div className="card max-w-sm bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="flex flex-col items-center gap-4">
                  <Twitch className="h-12 w-12 text-primary" />
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold">
                      Log in with your Twitch account
                    </h2>
                    <div className="space-y-2 text-base-content/70">
                      <p>
                        Live streams from people you follow will show here once
                        you're logged in.
                      </p>
                      <p>Use the button located in the upper right corner.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <FollowedStreamsView 
            accessToken={accessToken}
            username={userId}
            filteredStreams={filteredStreams}
          />
        )}

        {/* Bottom Navigation */}
        {accessToken && (
          <>
            <div className="btm-nav btm-nav-sm bg-base-100 border-t border-base-300">
              <button 
                className={filterBy === "all" ? "active" : ""}
                onClick={() => setFilterBy("all")}
              >
                <Users className="h-4 w-4" />
                <span className="btm-nav-label text-xs">All</span>
              </button>
              
              <button 
                className={filterBy === "gaming" ? "active" : ""}
                onClick={() => setFilterBy("gaming")}
              >
                <Gamepad className="h-4 w-4" />
                <span className="btm-nav-label text-xs">Gaming</span>
              </button>

              <div className="dropdown dropdown-top dropdown-end">
                <button className={`flex h-full w-full flex-col items-center justify-center gap-0.5 ${
                  sortBy !== "viewers-desc" ? "active" : ""
                }`}>
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="btm-nav-label text-xs">Sort</span>
                </button>
                <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 translate-y-[-0.5rem]">
                  <li>
                    <button 
                      className={sortBy === "viewers-desc" ? "active" : ""} 
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Setting sort to viewers desc');
                        setSortBy("viewers-desc");
                      }}
                    >
                      Viewers (High to Low)
                    </button>
                  </li>
                  <li>
                    <button 
                      className={sortBy === "viewers-asc" ? "active" : ""} 
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Setting sort to viewers asc');
                        setSortBy("viewers-asc");
                      }}
                    >
                      Viewers (Low to High)
                    </button>
                  </li>
                  <li>
                    <button 
                      className={sortBy === "started" ? "active" : ""} 
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Setting sort to started');
                        setSortBy("started");
                      }}
                    >
                      Recently Started
                    </button>
                  </li>
                  <li>
                    <button 
                      className={sortBy === "name" ? "active" : ""} 
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Setting sort to name');
                        setSortBy("name");
                      }}
                    >
                      Streamer Name
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
