import {useQuery} from "@tanstack/react-query";
import {fetchFollowedStreams} from "@src/lib/api/twitch";

export function useFollowedLiveStreams(accessToken: string | null, userId?: string) {
    const {data, isLoading, error} = useQuery({
        queryKey: ["followedStreams", accessToken, userId],
        queryFn: () => fetchFollowedStreams(accessToken!, userId!),
        enabled: !!accessToken && !!userId,
        refetchInterval: 60000, // Refetch every minute
        select: (data) => ({
            streams: Array.isArray(data) ? data : [],
            lastUpdated: new Date(),
        }),
    });

    return {
        streams: data?.streams || [],
        isLoading,
        error,
        lastUpdated: data?.lastUpdated || null,
    };
} 