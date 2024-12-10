import { TWITCH_CLIENT_ID } from "@src/lib/constants";

const TWITCH_API_BASE = "https://api.twitch.tv/helix";

type LiveStream = {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  tags: string[];
};

type TwitchResponse<T> = {
  data: T[];
  pagination: {
    cursor?: string;
  };
  total?: number;
};

export async function fetchFollowedStreams(
  accessToken: string,
  userId: string,
  first: number = 100
) {
  try {
    console.log("Fetching live streams for user:", userId);

    const url = new URL(`${TWITCH_API_BASE}/streams/followed`);
    url.searchParams.append("user_id", userId);
    url.searchParams.append("first", first.toString());

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": TWITCH_CLIENT_ID,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(`Error ${response.status}: ${errorData.message}`);
    }

    const data: TwitchResponse<LiveStream> = await response.json();
    console.log("Live streams data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching followed streams:", error);
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
