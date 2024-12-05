import { TWITCH_CLIENT_ID } from "@src/lib/constants";
import { Channel } from "node:diagnostics_channel";

const TWITCH_API_BASE = 'https://api.twitch.tv/helix';

type FollowedChannel = {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  followed_at: string;
};

type TwitchResponse<T> = {
  data: T[];
  pagination: {
    cursor?: string;
  };
  total?: number;
};

export async function fetchFollowedChannels(accessToken: string, userId: string, first: number = 100) {
  try {
    console.log('Fetching followed channels for user:', userId);

    const url = new URL(`${TWITCH_API_BASE}/channels/followed`);
    url.searchParams.append('user_id', userId);
    url.searchParams.append('first', first.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(`Error ${response.status}: ${errorData.message}`);
    }

    const data: TwitchResponse<FollowedChannel> = await response.json();
    console.log('Followed channels data:', data);
    return data;
  } catch (error) {
    console.error("Error fetching followed channels:", error);
    throw error;
  }
}

export async function fetchUserProfile(accessToken: string) {
  try {
    console.log('Making request with:', {
      accessToken: accessToken.substring(0, 10) + '...',
      clientId: TWITCH_CLIENT_ID
    });

    const response = await fetch(`${TWITCH_API_BASE}/users`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Full error response:', errorData);
      throw new Error(`Error ${response.status}: ${errorData.message}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
} 