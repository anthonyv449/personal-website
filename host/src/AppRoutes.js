import React, { useEffect, lazy, Suspense, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

const executedLoaders = new Set(); // Track which routes ran their loader
const initializedContainers = new Set(); // Track which remotes were initialized

function loadRemoteEntry(remoteTitle, remoteUrl) {
  return new Promise((resolve, reject) => {
    if (window[remoteTitle]) return resolve();

    const script = document.createElement("script");
    script.src = remoteUrl;
    script.async = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error(`Failed to load remote entry: ${remoteUrl}`));
    };
    document.head.appendChild(script);
  });
}

function useRemoteLoader(remoteTitle, remoteUrl, pathPrefix) {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith(pathPrefix)) {
      loadRemoteEntry(remoteTitle, remoteUrl)
        .then(() => console.log(`Remote ${remoteTitle} is available`))
        .catch((err) => console.error(err));
    }
  }, [location, remoteTitle, remoteUrl, pathPrefix]);
}

const RemoteRoute = ({ remote, remotesList }) => {
  const port = remotesList.find((r) => r.name === remote.title).port;

  const RemoteWrapper = () => {
    const [LazyComponent, setLazyComponent] = useState(null);

    useEffect(() => {
      let isMounted = true;

      (async () => {
        try {
          await loadRemoteEntry(
            remote.title,
            `http://localhost:${port}/remoteEntry.js`
          );

          await __webpack_init_sharing__("default");

          const container = window[remote.title];
          if (!container)
            throw new Error(`Container ${remote.title} not found`);

          if (!initializedContainers.has(remote.title)) {
            await container.init(__webpack_share_scopes__.default);
            initializedContainers.add(remote.title);
          }

          const factory = await container.get(remote.exposedModule);
          const Module = factory();

          if (
            typeof Module.loader === "function" &&
            !executedLoaders.has(remote.path)
          ) {
            await Module.loader();
            executedLoaders.add(remote.path);
            console.log("Finished loader for", remote.path);
          }

          const Component = Module.default || Module;

          // ✅ Set up the lazy component *only after everything is loaded and safe*
          if (isMounted) {
            const LazyLoaded = lazy(() =>
              Promise.resolve({ default: Component })
            );
            setLazyComponent(() => LazyLoaded);
          }
        } catch (err) {
          console.error("Error loading remote module:", err);
        }
      })();

      return () => {
        isMounted = false;
      };
    }, []);

    if (!LazyComponent) {
      return <div>Loading remote component...</div>;
    }

    return (
      <Suspense fallback={<div>Loading remote component...</div>}>
        <LazyComponent />
      </Suspense>
    );
  };

  return <RemoteWrapper />;
};

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
