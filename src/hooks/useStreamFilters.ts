import {useMemo, useState} from 'react';
import {useFollowedLiveStreams} from './useFollowedLiveStreams';

export type SortBy = 'viewers-desc' | 'viewers-asc' | 'started-desc' | 'started-asc' | 'name-desc' | 'name-asc';
export type FilterBy = 'live' | 'games';

export function useStreamFilters(accessToken: string | null, userId?: string) {
    const [sortBy, setSortBy] = useState<SortBy>('viewers-desc');
    const [filterBy, setFilterBy] = useState<FilterBy>('live');
    
    const {
        streams,
        isLoading,
        error,
        lastUpdated,
    } = useFollowedLiveStreams(accessToken, userId);

    const filteredAndSortedStreams = useMemo(() => {
        if (!streams?.length) return [];
        
        let result = [...streams];

        // Apply sorting
        const [sortType, sortDirection] = sortBy.split('-') as [string, 'asc' | 'desc'];
        
        result.sort((a, b) => {
            let comparison = 0;
            
            switch (sortType) {
                case 'viewers':
                    comparison = (b.viewer_count || 0) - (a.viewer_count || 0);
                    break;
                case 'started':
                    comparison = new Date(b.started_at).getTime() - new Date(a.started_at).getTime();
                    break;
                case 'name':
                    comparison = a.user_name.localeCompare(b.user_name);
                    break;
            }
            
            return sortDirection === 'asc' ? -comparison : comparison;
        });

        return result;
    }, [streams, sortBy]);

    return {
        streams: filteredAndSortedStreams,
        isLoading,
        error,
        sortBy,
        filterBy,
        setSortBy,
        setFilterBy,
        lastUpdated,
    };
}
