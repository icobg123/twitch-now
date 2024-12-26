import {Stream} from "@src/lib/api/twitch";

export type StreamGroup = {
  id: string;
  name: string;
  box_art_url: string;
  streams: Stream[];
};

export function useGroupedStreams(streams: Stream[]): StreamGroup[] {
  const groupedStreams = streams.reduce((acc, stream) => {
    const gameId = stream.game_id;
    if (!acc[gameId]) {
      acc[gameId] = {
        id: stream.game_id,
        name: stream.game_name,
        box_art_url: stream.game_box_art_url,
        streams: [],
      };
    }
    acc[gameId].streams.push(stream);
    return acc;
  }, {} as Record<string, StreamGroup>);

  return Object.values(groupedStreams).sort(
    (a, b) => b.streams.length - a.streams.length
  );
} 