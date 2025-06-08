// msalConfig.js

import { PublicClientApplication, LogLevel } from "@azure/msal-browser";

const REDIRECT = window.location.origin;    // e.g. http://localhost:3000 or https://learningwithant.com

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: "0cf6163b-47fb-4c0c-ab60-9cfc837f00ca",
    authority:
      "https://papichuloant.b2clogin.com/papichuloant.onmicrosoft.com/B2C_1_signin-signout",
    redirectUri: REDIRECT,                  // ← dynamic, always correct
    postLogoutRedirectUri: REDIRECT,        // ← likewise
    knownAuthorities: ["papichuloant.b2clogin.com"],
    // you can also explicitly set popupRedirectUri to the same if you like:
    popupRedirectUri: REDIRECT,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (!containsPii) console.log(`[MSAL] ${message}`);
      },
      logLevel: LogLevel.Info,
      piiLoggingEnabled: false,
    },
  },
});
