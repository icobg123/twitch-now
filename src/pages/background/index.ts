console.log("background script loaded");

browser.webRequest.onBeforeRequest.addListener(
  async (details) => {
    const url = new URL(details.url);
    
    // Check for access token in the URL fragment
    if (url.hash) {
      const params = new URLSearchParams(url.hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        await browser.storage.local.set({ twitchToken: accessToken });
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
    urls: ["https://oauth.example.com/callback*"],
    types: ['main_frame']
  },
  ["blocking"]
);
