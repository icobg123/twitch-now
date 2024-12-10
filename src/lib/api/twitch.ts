import { TWITCH_CLIENT_ID } from "@src/lib/constants";

const TWITCH_API_BASE = "https://api.twitch.tv/helix";

export type Stream = {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_name: string;
  title: string;
  viewer_count: number;
  started_at: string;
  thumbnail_url: string;
};

export async function fetchFollowedStreams(accessToken: string, userId: string): Promise<Stream[]> {
  console.log('🚀 Fetching streams with:', { 
    userId, 
    hasAccessToken: !!accessToken 
  });
  
  if (!accessToken || !userId) {
    console.log('❌ Missing credentials:', { hasToken: !!accessToken, hasUserId: !!userId });
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
      console.error('❌ API Error:', errorData);
      throw new Error(`Failed to fetch streams: ${errorData.message}`);
    }

    const data = await response.json();
    console.log('✅ Streams fetched:', data);
    return data.data;
  } catch (error) {
    console.error('❌ Fetch error:', error);
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
