import React, { Suspense, useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useRouteError,
} from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { ThemeProvider, CssBaseline, Grid2 as Grid } from "@mui/material";
import Navbar from "./Navbar.js";
import Footer from "./Footer.js";
import theme from "./theme.js";
import { ThemeContext } from "./ThemeContext.js";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalConfig.js";
import {
  useEnvStore,
  withRemotesPath,
  useGlobalData,
} from "@anthonyv449/ui-kit";

const executedLoaders = new Set();

/**
 * Generic lazy loader for Module Federation remotes
 */
export function lazyLoad({
  remoteName,
  remoteUrl,
  scope = remoteName,
  module: exposedModule,
}) {
  return React.lazy(
    () =>
      new Promise((resolve, reject) => {
        const scriptId = `${remoteName}-remote-script`;
        if (document.getElementById(scriptId)) {
          return loadRemoteModule();
        }
        const element = document.createElement("script");
        element.id = scriptId;
        element.src = remoteUrl;
        element.type = "text/javascript";
        element.async = false;
        element.onload = loadRemoteModule;
        element.onerror = () =>
          reject(new Error(`Failed to load remote entry: ${remoteUrl}`));
        document.head.appendChild(element);

        function waitForContainer(timeout = 2000) {
          const start = Date.now();
          return new Promise((res, rej) => {
            const check = () => {
              const container = window[scope];
              if (container) return res(container);
              if (Date.now() - start > timeout) {
                return rej(new Error(`Container ${scope} not found`));
              }
              setTimeout(check, 50);
            };
            check();
          });
        }

        function loadRemoteModule() {
          Promise.resolve(__webpack_init_sharing__("default"))
            .then(() => waitForContainer())
            .then((container) =>
              Promise.resolve(
                container.init(__webpack_share_scopes__.default)
              ).then(() => container)
            )
            .then((container) => container.get(exposedModule))
            .then((factory) => {
              const Module = factory();
              if (
                typeof Module.loader === "function" &&
                !executedLoaders.has(exposedModule)
              ) {
                return Promise.resolve(Module.loader()).then(() => {
                  executedLoaders.add(exposedModule);
                  return Module;
                });
              }
              return Module;
            })
            .then((Module) => resolve(Module))
            .catch((err) => reject(err));
        }
      })
  );
}

/**
 * Fetches Last-Modified header and returns a Date
 */
async function fetchLastModified(url) {
  const res = await fetch(url, { method: "HEAD", mode: "cors" });
  if (!res.ok) {
    throw new Error(`HEAD ${url} → ${res.status}`);
  }
  const header = res.headers.get("Last-Modified") ?? "2025";
  return new Date(header);
}

/**
 * Determine most recently modified remoteEntry
 */
async function getMostRecentRemote(remotes, isDev) {
  const urls = remotes.map((r) =>
    isDev
      ? `http://localhost:${r.port}/remoteEntry.js`
      : withRemotesPath(`${r.name.toLowerCase()}/latest/remoteEntry.js`)
  );
  const entries = await Promise.all(
    urls.map(async (url) => ({ url, date: await fetchLastModified(url) }))
  );
  return entries.reduce((prev, curr) => (curr.date > prev.date ? curr : prev));
}

function RouteError() {
  const error = useRouteError();
  console.error("Route error:", error);
  return (
    <div style={{ padding: 20 }}>
      <h1>Something went wrong</h1>
      <p>{error?.message ?? "Unknown error occurred."}</p>
    </div>
  );
}

export default function App() {
  const [content, setContent] = useState(null);
  const [remotes, setRemotes] = useState(null);
  const [hasLatest, setHasLatest] = useState(false);
  const [latestDate, setLatestDate] = useState(null);
  const { loaded, loadEnv, apiPath } = useEnvStore();
  const { loadUser } = useGlobalData();
  const isDev = process.env.NODE_ENV === "development";

  // Load environment, then user
  useEffect(() => {
    loadEnv();
  }, [loadEnv]);
  useEffect(() => {
    if (apiPath) loadUser();
  }, [apiPath, loadUser]);

  // Fetch content and remotes definitions
  useEffect(() => {
    if (!loaded) return;
    Promise.all([
      fetch("/content.json").then((r) => r.json()),
      fetch("/remotes.json").then((r) => r.json()),
    ])
      .then(([c, r]) => {
        setContent(c);
        setRemotes(r);
      })
      .catch((e) => console.error("Data fetch error:", e));
  }, [loaded]);

  // After remotes loaded, get latest modified date
  useEffect(() => {
    if (!remotes) return;
    async function updateLatest() {
      try {
        const { date } = await getMostRecentRemote(remotes, isDev);
        setLatestDate(date);
        setHasLatest(true);
      } catch (e) {
        console.error("Error fetching latest remote modified date:", e);
      }
    }
    updateLatest();
  }, [remotes, isDev]);

  // Delay render until all data is ready
  if (!content || !remotes || !hasLatest) {
    return <div>Loading...</div>;
  }

  // Build dynamic routes
  const dynamicRoutes = [];
  content.pages.forEach((page) => {
    const { path: pagePath, title, exposedModule, children } = page;
    const remoteCfg = remotes.find(
      (r) => r.name.toLowerCase() === title.toLowerCase()
    );
    if (!remoteCfg) return;
    const { name, port } = remoteCfg;
    const localUrl = `http://localhost:${port}/remoteEntry.js`;
    const prodUrl = withRemotesPath(
      `${name.toLowerCase()}/latest/remoteEntry.js`
    );
    const remoteEntryUrl = isDev ? localUrl : prodUrl;

    const createRoute = ({ path, moduleKey, pageTitle }) => {
      const trimmed = path.replace(/^\//, "");
      const Component = lazyLoad({
        remoteName: name,
        remoteUrl: remoteEntryUrl,
        module: moduleKey,
      });
      const element = (
        <>
          <Helmet>
            <title>{pageTitle}</title>
          </Helmet>
          <Suspense fallback={<div>Loading {name}...</div>}>
            <Component />
          </Suspense>
        </>
      );
      return trimmed === ""
        ? { index: true, element, errorElement: <RouteError /> }
        : { path: trimmed, element, errorElement: <RouteError /> };
    };

    dynamicRoutes.push(
      createRoute({
        path: pagePath,
        moduleKey: title,
        pageTitle: title,
      })
    );
    if (pagePath === "/") {
      dynamicRoutes.push(
        createRoute({
          path: "/home",
          moduleKey: title,
          pageTitle: title,
        })
      );
    }
    if (Array.isArray(children)) {
      children.forEach((child) => {
        dynamicRoutes.push(
          createRoute({
            path: child.path,
            moduleKey: child.exposedModule,
            pageTitle: child.title,
          })
        );
      });
    }
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <HelmetProvider>
          <Helmet>
            <title>My Host App</title>
          </Helmet>
          <Grid container direction="column" sx={{ minHeight: "100vh" }}>
            <Grid component="header" size="auto">
              <Navbar pages={content.pages} remotes={remotes} />
            </Grid>
            <Grid component="main" size="grow">
              <Suspense fallback={<div>Loading...</div>}>
                <Outlet />
              </Suspense>
            </Grid>
            <Grid component="footer" size="auto">
              <Footer latestDate={latestDate} />
            </Grid>
          </Grid>
        </HelmetProvider>
      ),
      errorElement: <RouteError />,
      children: dynamicRoutes,
    },
  ]);

  return (
    <MsalProvider instance={msalInstance}>
      <ThemeContext.Provider value={theme}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </ThemeContext.Provider>
    </MsalProvider>
  );
}
