import React, { useEffect } from "react";
import {
  Button,
  useTheme,
  Grid2 as Grid,
  Link as MuiLink,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import Logo from "../assets/logo.svg";
import { useGlobalData, withApiPath } from "@anthonyv449/ui-kit";

const Navbar = ({ pages }) => {
  const theme = useTheme();
  const { instance } = useMsal();
  const { user, setUser, logoutUser } = useGlobalData();

  const handleLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup({
        scopes: ["openid", "profile", "email"],
      });

      const idToken = loginResponse.idToken;

      const response = await fetch(withApiPath("/auth/microsoft"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const user = await response.json();
      setUser(user);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    instance.logoutPopup();
  };

  return (
    <Grid
      container
      direction="row"
      p="0 1.025rem 0 0"
      alignItems="center"
      justifyContent="space-between"
      borderBottom={`0.025rem solid ${theme.palette.primary.main}`}
      marginBottom="1rem"
    >
      <Grid>
        <Logo
          style={{
            width: "5rem",
            height: "5rem",
            fill: theme.palette.primary.main,
            stroke: theme.palette.primary.contrastText,
          }}
        />
      </Grid>
      <Grid size="auto">
        {pages.map((page) => (
          <MuiLink
            key={page.title.toLowerCase()}
            component={NavLink}
            to={page.path}
            sx={{
              textDecoration: "none",
              color: theme.palette.primary.main,
              marginRight: "1rem",
              borderRadius: "0.4rem",
              padding: ".125rem .5rem",
              "&.active": {
                color: `${theme.palette.primary.hoverText}`,
                backgroundColor: `${theme.palette.greys.default}`,
              },
            }}
          >
            {page.title}
          </MuiLink>
        ))}
        {user ? (
          <Button
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              paddingTop: "0.125rem",
            }}
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={handleLogin}
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              paddingTop: "0.125rem",
            }}
          >
            Sign in
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default Navbar;
