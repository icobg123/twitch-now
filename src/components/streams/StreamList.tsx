"use client";

import { useEffect, useState } from "react";

type Stream = {
  id: string;
  user_name: string;
  title: string;
  viewer_count: number;
  thumbnail_url: string;
};

type StreamListProps = {
  accessToken: string;
};

export function StreamList({ accessToken }: StreamListProps) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStreams() {
      try {
        // First get user's followed channels
        const followsResponse = await fetch(
          "https://api.twitch.tv/helix/streams/followed",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-Id": "gqeg1ie6vt78zu88vnq7mke4d3farc",
            },
          }
        );

        if (!followsResponse.ok) {
          throw new Error("Failed to fetch followed streams");
        }

        const followsData = await followsResponse.json();
        setStreams(followsData.data);
      } catch (err) {
        console.error("Error fetching streams:", err);
        setError("Failed to load streams");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStreams();
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="loading loading-spinner" />
      </div>
    );
  }

  if (error) {
    return <div className="text-error">{error}</div>;
  }

  if (streams.length === 0) {
    return <div className="text-center">No live streams found</div>;
  }

  return (
    <div className="grid gap-4">
      {streams.map((stream) => (
        <div key={stream.id} className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">{stream.user_name}</h2>
            <p>{stream.title}</p>
            <p className="text-sm">Viewers: {stream.viewer_count}</p>
            <img
              src={stream.thumbnail_url
                .replace("{width}", "320")
                .replace("{height}", "180")}
              alt={`${stream.user_name}'s stream`}
              className="rounded-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
