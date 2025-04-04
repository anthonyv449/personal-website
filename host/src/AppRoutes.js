import React, { useEffect, lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";

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

const findRemotePort = (rem, remotesList) => {
  for (const remote of remotesList) {
    // Direct match with parent
    if (remote.name === rem.title) {
      return remote.port;
    }

    // Check children titles
    if (Array.isArray(remote.children)) {
      const childMatch = remote.children.find(
        (child) => child.title === rem.title
      );
      if (childMatch) {
        return remote.port; // ✅ Return parent's port if child title matches
      }
    }
  }
  return null; // fallback if not found
};

const RemoteRoute = ({ remote, remotesList }) => {
  const port = findRemotePort(remote, remotesList);

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
      {content.pages.map((page) => {
        if (page.children?.length > 0) {
          return page.children.map((child) => {
            return (
              <Route
                key={child.id}
                path={child.path}
                element={<RemoteRoute remote={child} remotesList={remotes} />}
              />
            );
          });
        }
      })}
    </Routes>
  );
};

export default AppRoutes;
