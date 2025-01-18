import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const App = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch("/content.json")
      .then((res) => res.json())
      .then((data) => setContent(data));
  }, []);

  if (!content) return <div>Loading...</div>;

  return (
    <Router>
      <nav>
        {content.pages.map((page) => (
          <Link key={page.id} to={page.url} style={{ margin: "10px" }}>
            {page.title}
          </Link>
        ))}
      </nav>

      <Routes>
        {content.pages.map((page) => (
          <Route
            key={page.id}
            path={page.url}
            element={<h1>{page.sections[0].content.heading}</h1>}
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
