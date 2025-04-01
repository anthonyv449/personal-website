// msalConfig.js
import { PublicClientApplication, LogLevel } from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: "0cf6163b-47fb-4c0c-ab60-9cfc837f00ca",
    authority:
      "https://papichuloant.b2clogin.com/papichuloant.onmicrosoft.com/B2C_1_signin-signout",
    redirectUri: "http://localhost:3000",
    knownAuthorities: ["papichuloant.b2clogin.com"],
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
