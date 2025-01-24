import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar.js";
const App = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch("/content.json")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((error) => console.log(error));
  }, []);

  if (!content) return <div>Loading...</div>;

  return (
    <Router>
      {/* Pass `content.pages` (array of pages) to the NavBar */}
      <Navbar pages={content.pages} />
      <Routes>
        {content.pages.map((page) => (
          <Route key={page.id} path={page.url} />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
