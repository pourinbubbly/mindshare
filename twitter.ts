
// REAL TWITTER SERVICE
// Utilizing the Vite Proxy in development to forward requests to Port 5000

export const getBackendUrl = () => {
    // In development (with Vite Proxy) and Production, 
    // we can now simply use the relative path '/api'
    // The proxy (vite.config.ts) handles the redirection to localhost:5000
    return '/api';
};

export const TwitterService = {
  getAuthUrl: (discordId: string, region: string) => {
      // Use relative path directly. 
      // Browser will go to http://localhost:5173/api/auth/twitter
      // Vite Proxy forwards to http://localhost:5000/api/auth/twitter
      const safeUrl = `/api/auth/twitter`;
      
      const params = new URLSearchParams({
          discordId: discordId,
          region: region
      });
      
      return `${safeUrl}?${params.toString()}`;
  }
};