import React, { Suspense, lazy, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { withRemotesPath } from "@anthonyv449/ui-kit"; // adjust the import path as needed

const executedLoaders = new Set();
const initializedContainers = new Set();
let shareScopeInitialized = false;
const isDev = window.location.hostname === "localhost";

async function ensureShareScope() {
  if (!shareScopeInitialized) {
    await __webpack_init_sharing__("default");
    shareScopeInitialized = true;
  }
}

function loadRemoteEntry(remoteName, remoteUrl) {
  if (window[remoteName]) return Promise.resolve();

  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-remote=\"${remoteName}\"]`)) {
      return resolve();
    }

    const script = document.createElement("script");
    script.src = remoteUrl;
    script.async = false;                    // ensure insertion/execution order
    script.dataset.remote = remoteName;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load remote entry: ${remoteUrl}`));
    document.head.appendChild(script);
  });
}

async function loadRemoteModule(remoteName, remoteUrl, exposedModule) {
  // 1) register host share-scope (React, ReactDOM, etc.)
  await ensureShareScope();

  // 2) inject & execute remoteEntry.js
  await loadRemoteEntry(remoteName, remoteUrl);

  const container = window[remoteName];
  if (!container) {
    throw new Error(`Container ${remoteName} not found on window`);
  }

  // 3) initialize container once
  if (!initializedContainers.has(remoteName)) {
    await container.init(__webpack_share_scopes__.default);
    initializedContainers.add(remoteName);
  }

  // 4) fetch the exposed module factory
  const factory = await container.get(exposedModule);
  const Module = factory();

  // 5) run any loader hook once
  if (typeof Module.loader === "function" && !executedLoaders.has(exposedModule)) {
    await Module.loader();
    executedLoaders.add(exposedModule);
  }

  // 6) return the component
  return Module.default || Module;
}

const findRemotePort = (rem, remotesList) => {
  for (const remote of remotesList) {
    if (remote.name === rem.title) return remote.port;
    if (Array.isArray(remote.children)) {
      const child = remote.children.find(c => c.title === rem.title);
      if (child) return remote.port;
    }
  }
  return null;
};

const RemoteRoute = ({ remote, remotesList }) => {
  const port = findRemotePort(remote, remotesList);
  const remoteConfig = remotesList.find(
    r => r.name === remote.title || (r.children || []).some(c => c.title === remote.title)
  );
  if (!remoteConfig) {
    console.error(`Remote config not found for ${remote.title}`);
    return <div>Error: remote not configured</div>;
  }

  const remoteUrl = isDev
    ? `http://localhost:${port}/remoteEntry.js`
    : withRemotesPath(`/${remoteConfig.name.toLowerCase()}/remoteEntry.js`);

  const LazyComponent = useMemo(
    () =>
      lazy(() =>
        loadRemoteModule(remote.title, remoteUrl, remote.exposedModule).then(comp => ({ default: comp }))
      ),
    [remote.title, remoteUrl, remote.exposedModule]
  );

  return (
    <Suspense fallback={<div>Loading remote component...</div>}>
      <LazyComponent />
    </Suspense>
  );
};

const AppRoutes = ({ content, remotes }) => (
  <Routes>
    {content.pages.map(page => (
      <Route
        key={page.id}
        path={page.path}
        element={<RemoteRoute remote={page} remotesList={remotes} />}
      />
    ))}
    {content.pages.map(page =>
      page.children?.length > 0
        ? page.children.map(child => (
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

export default AppRoutes;