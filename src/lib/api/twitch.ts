import {TWITCH_CLIENT_ID} from "@src/lib/constants";

const TWITCH_API_BASE = "https://api.twitch.tv/helix";

export type Stream = {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  game_box_art_url: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tags: string[];
  is_mature: boolean;
};

export type Game = {
  id: string;
  name: string;
  box_art_url: string;
  viewer_count?: number;
  broadcaster_count?: number;
};

export async function fetchFollowedStreams(
  accessToken: string,
  userId: string
): Promise<Stream[]> {
  console.log("🚀 Fetching streams with:", {
    userId,
    hasAccessToken: !!accessToken,
  });

  if (!accessToken || !userId) {
    console.log("❌ Missing credentials:", {
      hasToken: !!accessToken,
      hasUserId: !!userId,
    });
    return [];
  }

  try {
    const response = await fetch(
      `https://api.twitch.tv/helix/streams/followed?user_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ API Error:", errorData);
      throw new Error(`Failed to fetch streams: ${errorData.message}`);
    }

    const data = await response.json();
    
    const streamsWithGameArt = data.data.map((stream: Stream) => ({
      ...stream,
      game_box_art_url: `https://static-cdn.jtvnw.net/ttv-boxart/${stream.game_id}-285x380.jpg`
    }));

    console.log("✅ Streams fetched:", streamsWithGameArt);
    return streamsWithGameArt;
  } catch (error) {
    console.error("❌ Fetch error:", error);
    throw error;
  }
}

export async function fetchUserProfile(accessToken: string) {
  try {
    console.log("Making request with:", {
      accessToken: accessToken.substring(0, 10) + "...",
      clientId: TWITCH_CLIENT_ID,
    });

    const response = await fetch(`${TWITCH_API_BASE}/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": TWITCH_CLIENT_ID,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Full error response:", errorData);
      throw new Error(`Error ${response.status}: ${errorData.message}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function fetchFollowedGames(accessToken: string, userId: string) {
  // First get followed channels
  const followedResponse = await fetch(
    `${TWITCH_API_BASE}/channels/followed?user_id=${userId}&first=100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
      },
    }
  );

  if (!followedResponse.ok) {
    const errorData = await followedResponse.json();
    throw new Error(`Failed to fetch followed channels: ${errorData.message}`);
  }

  const followedData = await followedResponse.json();

  // Get unique game IDs from live streams
  const streamsResponse = await fetch(
    `${TWITCH_API_BASE}/streams?user_id=${followedData.data.map((f: any) => f.broadcaster_id).join("&user_id=")}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
      },
    }
  );

  if (!streamsResponse.ok) {
    const errorData = await streamsResponse.json();
    throw new Error(`Failed to fetch streams: ${errorData.message}`);
  }

  const streamsData = await streamsResponse.json();

  // Get unique game IDs
  const gameIds = [...new Set(streamsData.data.map((s: Stream) => s.game_id))];

  if (gameIds.length === 0) {
    return {
      games: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  // Fetch game details
  const gamesResponse = await fetch(
    `${TWITCH_API_BASE}/games?id=${gameIds.join("&id=")}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
      },
    }
  );

  if (!gamesResponse.ok) {
    const errorData = await gamesResponse.json();
    throw new Error(`Failed to fetch games: ${errorData.message}`);
  }

  const gamesData = await gamesResponse.json();

  // Add viewer and broadcaster counts to each game
  const gamesWithStats = gamesData.data.map((game: Game) => {
    const gameStreams = streamsData.data.filter(
      (s: Stream) => s.game_id === game.id
    );
    return {
      ...game,
      viewer_count: gameStreams.reduce(
        (total: number, stream: Stream) => total + stream.viewer_count,
        0
      ),
      broadcaster_count: gameStreams.length,
    };
  });

  return {
    games: gamesWithStats,
    lastUpdated: new Date().toISOString(),
  };
}
