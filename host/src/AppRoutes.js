import React, { useEffect, lazy, Suspense, useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { ThemeContext } from "./ThemeContext.js";

// Helper to load the remoteEntry script using remote.title
function loadRemoteEntry(remoteTitle, remoteUrl) {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window[remoteTitle]) {
      return resolve();
    }
    const script = document.createElement("script");
    script.src = remoteUrl;
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
      console.log(`Remote ${remoteTitle} loaded from ${remoteUrl}`);
      resolve();
    };
    script.onerror = () => {
      reject(new Error(`Failed to load remote entry: ${remoteUrl}`));
    };
    document.head.appendChild(script);
  });
}

// Custom hook to load remoteEntry when the current path matches
function useRemoteLoader(remoteTitle, remoteUrl, pathPrefix) {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith(pathPrefix)) {
      loadRemoteEntry(remoteTitle, remoteUrl)
        .then(() => {
          console.log(`Remote ${remoteTitle} is available`);
        })
        .catch((err) => console.error(err));
    }
  }, [location, remoteTitle, remoteUrl, pathPrefix]);
}

// Component to load and render a remote component using Module Federation runtime API
const RemoteRoute = ({ remote, remotesList }) => {
  const theme = useContext(ThemeContext);
  // Use remote.title in place of remote.name
  const port = remotesList.find((r) => r.name == remote.title).port;
  useRemoteLoader(
    remote.title,
    `http://localhost:${port}/remoteEntry.js`,
    remote.path
  );

  // Lazy-load the remote component via Module Federation's runtime API
  const RemoteComponent = lazy(async () => {
    // Ensure remoteEntry is loaded
    await loadRemoteEntry(
      remote.title,
      `http://localhost:${port}/remoteEntry.js`
    );

    // Initialize sharing scope if not already done
    await __webpack_init_sharing__("default");

    const container = window[remote.title];
    if (!container) {
      throw new Error(`Container ${remote.title} not found on window.`);
    }

    // Initialize the container with the shared scope
    await container.init(__webpack_share_scopes__.default);

    // Retrieve the module factory using the exposed key (for example, "./Home")
    const factory = await container.get(remote.exposedModule);

    // Execute the factory to obtain the module
    const Module = factory();
    return Module;
  });

  return (
    <Suspense fallback={<div>Loading remote component...</div>}>
      <ThemeProvider theme={theme}>
        <RemoteComponent />
      </ThemeProvider>
    </Suspense>
  );
};

// Component to setup routes based on content.json
const AppRoutes = ({ content, remotes }) => {
  return (
    <Routes>
      {content.pages.map((page) => (
        <Route
          key={page.id}
          path={page.path}
          element={<RemoteRoute remote={page} remotesList={remotes} />}
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
