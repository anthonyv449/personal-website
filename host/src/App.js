import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar.js";

// Dynamically load remotes
const loadRemoteComponent = (remoteName, exposedModule) => {
  return lazy(() =>
    import(`${remoteName}/${exposedModule}`).catch((err) => {
      console.log(err);
      console.error(
        `Failed to load remote: ${remoteName}/${exposedModule}`,
        err
      );
    })
  );
};

const App = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    // Fetch the content.json which includes pages and remotes
    fetch("/content.json")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((error) => console.log(error));
  }, []);

  if (!content) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar pages={content.pages} />
      <Routes>
        {/* Render the local routes */}
        {content.pages.map((page) => (
          <Route
            key={page.id}
            path={page.url}
            element={<PageRenderer page={page} />}
          />
        ))}

        {/* Dynamically render remote routes */}
        {content.pages?.map((remote) => {
          console.log(remote.exposedModule);
          const RemoteComponent = loadRemoteComponent(
            remote.title,
            remote.exposedModule
          );

          return (
            <Route
              key={remote.title}
              path={remote.path}
              element={
                <Suspense fallback={<div>Loading remote...</div>}>
                  <RemoteComponent />
                </Suspense>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
};

// Component to render local page content
const PageRenderer = ({ page }) => {
  const firstSection = page.sections?.[0];
  return (
    <div>
      <h1>{firstSection?.content.heading || "Page Content"}</h1>
    </div>
  );
};

export default App;
