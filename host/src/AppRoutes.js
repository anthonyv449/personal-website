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
      console.log(`Remote ${remoteTitle} loaded from ${remoteUrl}`);
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

  useRemoteLoader(
    remote.title,
    `http://localhost:${port}/remoteEntry.js`,
    remote.path
  );

  const RemoteWrapper = () => {
    const [Component, setComponent] = useState(null);
    const [loaderComplete, setLoaderComplete] = useState(false);

    useEffect(() => {
      (async () => {
        await loadRemoteEntry(
          remote.title,
          `http://localhost:${port}/remoteEntry.js`
        );

        await __webpack_init_sharing__("default");

        const container = window[remote.title];
        if (!container) {
          throw new Error(`Container ${remote.title} not found on window.`);
        }

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
          console.log("Running loader for:", remote.path);
          await Module.loader();
          executedLoaders.add(remote.path);
          console.log("Finished running loader");
        }

        const LoadedComponent = Module.default || Module;
        setComponent(() => LoadedComponent);
        setLoaderComplete(true);
      })();
    }, []);

    if (!loaderComplete || !Component) {
      return <div>Loading data...</div>;
    }

    const LazyComponent = lazy(() => Promise.resolve({ default: Component }));

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
