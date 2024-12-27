console.log("background script loaded");

const REDIRECT_URLS = [
  "http://localhost:3000/auth/callback*",
  "https://icobg123.github.io/streamerlens.github.io/auth/callback*"
];

browser.webRequest.onBeforeRequest.addListener(
  async (details) => {
    const url = new URL(details.url);
    
    // Check for access token in the URL fragment
    if (url.hash) {
      const params = new URLSearchParams(url.hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        console.log("Storing access token...");
        await browser.storage.local.set({ twitchToken: accessToken });
        console.log("Access token stored successfully");
        return { cancel: true }; // Prevent the actual redirect
      }
    }
    
    // Check for error
    if (url.searchParams.has('error')) {
      console.error('Auth error:', 
        url.searchParams.get('error'),
        url.searchParams.get('error_description')
      );
      return { cancel: true };
    }
    
    return { cancel: false };
  },
  {
    urls: REDIRECT_URLS,
    types: ['main_frame']
  },
  ["blocking"]
);
