import {StreamSkeleton} from "../streams/StreamSkeleton";

export function GameGroupSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="skeleton bg-primary/20 h-[40px] w-[85px] rounded"></div>
                <div className="skeleton bg-primary/20 h-7 w-40 rounded"></div>
            </div>
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((i) => (
                    <StreamSkeleton key={i} />
                ))}
            </div>
        </div>
    );
} 