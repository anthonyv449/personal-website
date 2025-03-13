import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Navbar.js";
import AppRoutes from "./AppRoutes.js";

const App = () => {
  const [content, setContent] = useState(null);
  const [remotes, setRemotes] = useState(null);
  useEffect(() => {
    // Fetch content.json which includes pages and remote configuration
    fetch("/content.json")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((error) => console.log(error));
    fetch("/remotes.json")
      .then((res) => res.json())
      .then((data) => setRemotes(data))
      .catch((error) => console.log(error));
  }, []);

  if (!content || !remotes) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar pages={content.pages} />
      <AppRoutes content={content} remotes={remotes} />
    </Router>
  );
};

export default App;
