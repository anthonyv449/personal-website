import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, Grid2 as Grid } from "@mui/material";
import Navbar from "./Navbar.js";
import AppRoutes from "./AppRoutes.js";
import theme from "./theme.js";
import Footer from "./Footer"; // Add this import
import { ThemeContext } from "./ThemeContext.js";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalConfig"; // adjust path if needed
import { useEnvStore, withBasePath } from "@anthonyv449/ui-kit";

const App = () => {
  const [content, setContent] = useState(null);
  const [remotes, setRemotes] = useState(null);
  const { loaded, loadEnv } = useEnvStore();

  useEffect(() => {
    loadEnv();
  }, [loadEnv]);

  useEffect(() => {
    if (!loaded) return;
    fetch(withBasePath("/content.json"))
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((error) => console.log(error));

    fetch(withBasePath("/remotes.json"))
      .then((res) => res.json())
      .then((data) => setRemotes(data))
      .catch((error) => console.log(error));
  }, [loaded]);

  if (!content || !remotes) return <div>Loading...</div>;

  return (
    <MsalProvider instance={msalInstance}>
      <ThemeContext.Provider value={theme}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Grid
              container
              direction="column"
              component="div"
              sx={{ minHeight: "100vh" }}
            >
              <Grid component="header" size="auto">
                <Navbar pages={content.pages} />
              </Grid>
              <Grid component="main" size="grow">
                <AppRoutes content={content} remotes={remotes} />
              </Grid>
              <Grid component="footer" size="auto">
                <Footer />
              </Grid>
            </Grid>
          </Router>
        </ThemeProvider>
      </ThemeContext.Provider>
    </MsalProvider>
  );
};

export default App;
