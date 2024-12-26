"use client";

import {useTwitchAuth} from "@src/hooks/useTwitchAuth";
import {useStreamFilters} from "@src/hooks/useStreamFilters";
import {AlertCircle, Twitch} from "lucide-react";
import {Header} from "@src/components/navigation/Header";
import {FollowedStreamsView} from "@src/components/streams/FollowedStreamsView";
import {StreamsNavigation} from "@src/components/navigation/StreamsNavigation";
import {GroupedStreamsView} from "@src/components/grouped-streams/GroupedStreamsView";
import {useCallback} from "react";

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
        isLoading: isStreamsLoading,
        error: streamsError,
        sortBy,
        filterBy,
        setSortBy,
        setFilterBy,
        lastUpdated: streamsLastUpdated,
    } = useStreamFilters(accessToken, userId);

    const handleRetry = useCallback(() => {
        setError(null);
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    }, [setError]);

    // Handle errors
    const errorMessage = authError || streamsError;
    if (errorMessage) {
        return (
            <div className="flex flex-col items-center gap-4 bg-base-200 p-6">
                <div className="alert alert-error">
                    <AlertCircle className="h-6 w-6 shrink-0 stroke-current"/>
                    <span>{errorMessage instanceof Error ? errorMessage.message : errorMessage}</span>
                </div>
                <button onClick={handleRetry} className="btn btn-primary btn-sm">Retry</button>
            </div>
        );
    }

    const safeStreams = Array.isArray(streams) ? streams : [];

    return (
        <div className="flex h-[600px] w-[400px] flex-col bg-base-200">
            <Header
                accessToken={accessToken}
                username={username}
                isAuthLoading={isAuthLoading}
                isAuthenticating={isAuthenticating}
                streamsCount={safeStreams.length}
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
                                        <Twitch className="h-12 w-12 text-primary"/>
                                        <div className="space-y-3">
                                            <h2 className="text-xl font-semibold">
                                                Log in with your Twitch account
                                            </h2>
                                            <div className="space-y-2 text-base-content/70">
                                                <p>Live streams from people you follow will show here once you're logged in.</p>
                                                <p>Use the button located in the upper right corner.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : filterBy === "live" ? (
                        <FollowedStreamsView
                            isLoading={isStreamsLoading}
                            streams={safeStreams}
                            lastUpdated={streamsLastUpdated}
                        />
                    ) : (
                        <GroupedStreamsView
                            isLoading={isStreamsLoading}
                            streams={safeStreams}
                            lastUpdated={streamsLastUpdated}
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
