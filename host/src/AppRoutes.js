import React, { useEffect, lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { withRemotesPath } from "@anthonyv449/ui-kit"; // adjust the import path as needed

const executedLoaders = new Set(); // Track which routes ran their loader
const initializedContainers = new Set(); // Track which remotes were initialized
const isDev = window.location.hostname === "localhost";

function loadRemoteEntry(remoteTitle, remoteUrl) {
  return new Promise((resolve, reject) => {
    if (window[remoteTitle]) return resolve();

    const script = document.createElement("script");
    script.src = remoteUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load remote entry: ${remoteUrl}`));
    document.head.appendChild(script);
  });
}

const findRemotePort = (rem, remotesList) => {
  for (const remote of remotesList) {
    if (remote.name === rem.title) {
      return remote.port;
    }
    if (Array.isArray(remote.children)) {
      const childMatch = remote.children.find(
        (child) => child.title === rem.title
      );
      if (childMatch) return remote.port;
    }
  }
  return null;
};

const RemoteRoute = ({ remote, remotesList }) => {
  const port = findRemotePort(remote, remotesList);

  const RemoteWrapper = () => {
    const [LazyComponent, setLazyComponent] = useState(null);

    useEffect(() => {
      let isMounted = true;

      (async () => {
        try {
          const remoteConfig = remotesList.find(
            (r) =>
              r.name === remote.title ||
              (r.children || []).some((c) => c.title === remote.title)
          );

          if (!remoteConfig) {
            throw new Error(`Remote config not found for ${remote.title}`);
          }

          const remoteUrl = isDev
            ? `http://localhost:${port}/remoteEntry.js`
            : withRemotesPath(`/${remoteConfig.name.toLowerCase()}/latest/remoteEntry.js`);

          await loadRemoteEntry(remote.title, remoteUrl);
          await __webpack_init_sharing__("default");

          const container = window[remote.title];
          if (!container) throw new Error(`Container ${remote.title} not found`);

          if (!initializedContainers.has(remote.title)) {
            await container.init(__webpack_share_scopes__.default);
            initializedContainers.add(remote.title);
          }

          const factory = await container.get(remote.exposedModule);
          const Module = factory();

          if (isMounted) {
            const LazyLoaded = lazy(async () => {
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

              return { default: Module.default || Module };
            });

            setLazyComponent(() => LazyLoaded);
          }
        } catch (err) {
          console.error("Error loading remote module:", err);
        }
      })();

      return () => {
        isMounted = false;
      };
    }, [remote, remotesList]);

    if (!LazyComponent) return <div>Loading remote component...</div>;

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

      {content.pages.map((page) =>
        page.children?.length > 0
          ? page.children.map((child) => (
              <Route
                key={child.id}
                path={child.path}
                element={<RemoteRoute remote={child} remotesList={remotes} />}
              />
            ))
          : null
      )}
    </Routes>
  );
};

export default AppRoutes;