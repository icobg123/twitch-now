"use client";

import {useTwitchAuth} from "@src/hooks/useTwitchAuth";
import {useStreamFilters} from "@src/hooks/useStreamFilters";
import {AlertCircle, Twitch} from "lucide-react";
import {Header} from "@src/components/navigation/Header";
import {FollowedStreamsView} from "@src/components/streams/FollowedStreamsView";
import {StreamsNavigation} from "@src/components/navigation/StreamsNavigation";

export function Popup() {
  const {
    accessToken,
    username,
    userId,
    isLoading: isAuthLoading,
    error: authError,
    isAuthenticating,
    handleLogin,
    handleLogout,
    setError,
  } = useTwitchAuth();

  const {
    streams,
    isLoading,
    error,
    sortBy,
    filterBy,
    setSortBy,
    setFilterBy,
    lastUpdated,
  } = useStreamFilters();

  // Handle errors - convert Error objects to strings
  const errorMessage = authError || error;
  if (errorMessage) {
    return (
      <div className="flex flex-col items-center gap-4 bg-base-200 p-6">
        <div className="alert alert-error">
          <AlertCircle className="h-6 w-6 shrink-0 stroke-current" />
          <span>
            {errorMessage instanceof Error ? errorMessage.message : errorMessage}
          </span>
        </div>
        <button onClick={() => setError(null)} className="btn btn-primary btn-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] w-[400px] flex-col bg-base-200">
      <Header
        accessToken={accessToken}
        username={username}
        isAuthLoading={isAuthLoading}
        isAuthenticating={isAuthenticating}
        streamsCount={streams.length}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="pb-16">
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
              isLoading={isLoading}
              streams={streams}
              lastUpdated={lastUpdated}
            />
          )}
        </div>
      </main>
      {accessToken && (
        <StreamsNavigation
          filterBy={filterBy}
          sortBy={sortBy}
          setFilterBy={setFilterBy}
          setSortBy={setSortBy}
        />
      )}
    </div>
  );
}
