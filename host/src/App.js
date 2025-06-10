import React, { Suspense, useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useRouteError } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ThemeProvider, CssBaseline, Grid2 as Grid } from '@mui/material';
import Navbar from './Navbar.js';
import Footer from './Footer.js';
import theme from './theme.js';
import { ThemeContext } from './ThemeContext.js';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './msalConfig.js';
import { useEnvStore, withRemotesPath } from '@anthonyv449/ui-kit';
import { useGlobalData } from '@anthonyv449/ui-kit';

const executedLoaders = new Set();
/**
 * Generic lazy loader for Module Federation remotes
 * @param {{remoteName: string, remoteUrl: string, scope?: string, module: string}} options
 */
export function lazyLoad({ remoteName, remoteUrl, scope = remoteName, module }) {
  return React.lazy(
    () =>
      new Promise((resolve, reject) => {
        const scriptId = `${remoteName}-remote-script`;
        if (document.getElementById(scriptId)) {
          return loadModule();
        }
        const element = document.createElement('script');
        element.id = scriptId;
        element.src = remoteUrl;
        element.type = 'text/javascript';
        element.async = false;
        element.onload = loadModule;
        element.onerror = () => reject(new Error(`Failed to load remote entry: ${remoteUrl}`));
        document.head.appendChild(element);

        function loadModule() {
          // Initialize shared scope for module federation
          
          Promise.resolve(__webpack_init_sharing__('default'))
            .then(() => Promise.resolve(window[scope].init(__webpack_share_scopes__.default)))
            .then(() => window[scope].get(module))
            .then(factory => factory())
            .then(Module => 
                resolve(Module)
            )
            .catch(reject);
        }
      })
  );
}

function RouteError() {
  const error = useRouteError();
  console.error('Route error:', error);
  return (
    <div style={{ padding: 20 }}>
      <h1>Something went wrong</h1>
      <p>{error?.message ?? 'Unknown error occurred.'}</p>
    </div>
  );
}

export default function App() {
  
  const [content, setContent] = useState(null);
  const [remotes, setRemotes] = useState(null);
  const { loaded, loadEnv, apiPath, hostPath } = useEnvStore();
  const { loadUser } = useGlobalData();
  const isDev = process.env.NODE_ENV === 'development';

  // Load environment and user data
  useEffect(() => { loadEnv(); }, [loadEnv]);
  useEffect(() => { if (apiPath) loadUser(); }, [apiPath, loadUser]);

  // Fetch content and remotes definitions
  useEffect(() => {
    if (!loaded) return;
    Promise.all([
      fetch(`${hostPath}/content.json`).then(res => res.json()),
      fetch(`${hostPath}/remotes.json`).then(res => res.json()),
    ])
      .then(([contentData, remotesData]) => {
        setContent(contentData);
        setRemotes(remotesData);
      })
      .catch(error => console.error('Data fetch error:', error));
  }, [loaded, hostPath]);

  if (!content || !remotes) return <div>Loading...</div>;

  // Build dynamic route entries based on content.pages
  const dynamicRoutes = [];

  content.pages.forEach(page => {
    const { id, path: pagePath, title, exposedModule, children } = page;
    const remoteConfig = remotes.find(r => r.name.toLowerCase() === id.toLowerCase());
    if (!remoteConfig) return;

    const { name: remoteName, port, folder, entry } = remoteConfig;
    const entryPath = entry.replace(/^\.\//, '').replace(/^\/+/, '');

    // Determine remote entry URL depending on environment
    const localUrl = `http://localhost:${port}/remoteEntry.js`;
    const prodPath = `${remoteName.toLowerCase()}/remoteEntry.js`;
    const remoteEntryUrl = isDev
      ? localUrl
      : withRemotesPath(prodPath);

    const createRoute = ({ path, moduleKey, pageTitle }) => {
      const trimmed = path.replace(/^\//, '');
      const RemoteComponent = lazyLoad({ remoteName, remoteUrl: remoteEntryUrl, scope: remoteName, module: moduleKey });
      const element = (
        <>
          <Helmet><title>{pageTitle}</title></Helmet>
          <Suspense fallback={<div>Loading {remoteName}...</div>}>
            <RemoteComponent />
          </Suspense>
        </>
      );
      return trimmed === ''
        ? { index: true, element, errorElement: <RouteError /> } //this is for home 
        : { path: trimmed, element, errorElement: <RouteError /> };
    };

    // Top-level route for this page
    dynamicRoutes.push(createRoute({ path: pagePath, moduleKey: exposedModule, pageTitle: title }));
    // Child routes if any
    if (Array.isArray(children)) {
      children.forEach(child => {
        dynamicRoutes.push(createRoute({ path: child.path, moduleKey: child.exposedModule, pageTitle: child.title }));
      });
    }
  });

  // Configure router with layout
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <HelmetProvider>
          <Helmet><title>My Host App</title></Helmet>
          <Grid container direction="column" sx={{ minHeight: '100vh' }}>
            <Grid component="header" size="auto"><Navbar pages={content.pages} remotes={remotes} /></Grid>
            <Grid component="main" size="grow"><Suspense fallback={<div>Loading...</div>}><Outlet /></Suspense></Grid>
            <Grid component="footer" size="auto"><Footer /></Grid>
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
        <ThemeProvider theme={theme}><CssBaseline /><RouterProvider router={router} /></ThemeProvider>
      </ThemeContext.Provider>
    </MsalProvider>
  );
}
