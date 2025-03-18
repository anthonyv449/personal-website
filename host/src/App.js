import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Navbar from "./Navbar.js";
import AppRoutes from "./AppRoutes.js";
import theme from "./theme.js"; // Import theme
import { ThemeContext } from "./ThemeContext.js"; // Import ThemeContext

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
    <ThemeContext.Provider value={theme}>
      {" "}
      {/* Provide theme via context */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar pages={content.pages} />
          <AppRoutes content={content} remotes={remotes} />
        </Router>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;
