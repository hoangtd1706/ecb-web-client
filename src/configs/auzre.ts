import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId:
      process.env.AZURE_CLIENT_ID || "0f297dc1-bee5-4c1f-92a6-043286710fd1",
    authority:
      process.env.AZURE_AUTHORITY ||
      "https://login.microsoftonline.com/2b5438a9-6a60-437b-afb7-2cc6fd444d86",
    redirectUri: process.env.AZURE_REDIRET_URI || "http://localhost:3000/",
  },
  cache: {
    cacheLocation: process.env.AZURE_CACHE_LOCATION || "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: any, message: any, containsPii: any) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};
