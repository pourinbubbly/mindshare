
// REAL TWITTER SERVICE
// This service no longer simulates data.
// It relies entirely on the Backend (server.js) to perform OAuth and Data fetching.

// CHANGED: Port 8080 -> 5000
const BACKEND_URL = 'http://localhost:5000/api';

export const TwitterService = {
  // The frontend no longer handles auth directly. 
  // It redirects the browser to the backend OAuth endpoint.
  getAuthUrl: (discordId: string, region: string) => {
      return `${BACKEND_URL}/auth/twitter?discordId=${encodeURIComponent(discordId)}&region=${encodeURIComponent(region)}`;
  }
};