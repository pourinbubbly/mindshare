
// REAL TWITTER API INTEGRATION SERVICE
// Uses the provided credentials to fetch actual user data.

const API_KEY = 'vvXKBxfwBVG5SmQwXt29KpNTJ';
const API_SECRET = 'b53Y5X3KBUIJYMozhLaNUvjOQ3hfFratOi4S9g3SgKoSvLhd0N';

// We use a CORS proxy to bypass browser restrictions since we don't have a Node.js backend server.
// In a production environment with a backend, you would call your own server instead of this proxy.
const CORS_PROXY = 'https://corsproxy.io/?'; 

interface TwitterUserResponse {
  data?: {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
    public_metrics?: {
      followers_count: number;
      following_count: number;
      tweet_count: number;
      listed_count: number;
    }
  };
  errors?: any[];
}

export const TwitterService = {
  // 1. Authenticate and get Bearer Token
  getBearerToken: async (): Promise<string | null> => {
    try {
      const credentials = btoa(`${API_KEY}:${API_SECRET}`);
      
      const response = await fetch(`${CORS_PROXY}https://api.twitter.com/oauth2/token?grant_type=client_credentials`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      });

      if (!response.ok) {
        throw new Error(`Auth Failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Twitter Auth Error:', error);
      return null;
    }
  },

  // 2. Fetch User Data by Username
  getUserData: async (username: string): Promise<TwitterUserResponse | null> => {
    try {
      const token = await TwitterService.getBearerToken();
      if (!token) throw new Error('No Bearer Token obtained');

      // Remove @ if present
      const cleanUsername = username.replace('@', '');

      const response = await fetch(
        `${CORS_PROXY}https://api.twitter.com/2/users/by/username/${cleanUsername}?user.fields=profile_image_url,public_metrics`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
         // Handle 404 or 429 specifically if needed
         if (response.status === 404) console.warn('User not found on Twitter');
         if (response.status === 429) console.warn('Rate limit exceeded');
         return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Twitter Fetch Error:', error);
      return null;
    }
  }
};
