// msalConfig.js
import { PublicClientApplication } from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: "00000000-0000-0000-0000-000000000000", // dummy GUID
    authority:
      "https://fakedomain.b2clogin.com/fake.onmicrosoft.com/B2C_1_test",
    redirectUri: "http://localhost:3000",
    knownAuthorities: ["fakedomain.b2clogin.com"],
  },
});
