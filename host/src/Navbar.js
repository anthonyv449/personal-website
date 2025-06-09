import React, { useState, useEffect} from "react";
import {
  Button,
  useTheme,
  Grid2 as Grid,
  Link as MuiLink,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import Logo from "../assets/logo.svg";
import { useEnvStore } from "@anthonyv449/ui-kit";

const Navbar = ({ pages }) => {
  const theme = useTheme();
  const { instance, accounts } = useMsal();
  const { apiPath } = useEnvStore();
  const [user, setUser] = useState(null);
  
  const handleLogin = async () => {
     await instance.loginPopup({
      scopes: ["openid", "profile", "email"]
    }).then((loginResponse)=>
    { 
      var idToken = loginResponse.idToken;
      fetch(`${apiPath}/auth/microsoft`, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ idToken })
      });
    }
    ).catch((err) => {
        console.error("Login failed", err);
      });
  };

  const handleLogout = async () => {
      await fetch(`${apiPath}/auth/logout`, {
    method: "POST",
    credentials: "include"
  });
    instance.logoutPopup();
  };

  useEffect(()=>{
    var user = accounts.length > 0 ? accounts[0] : null
    setUser(user);
  },[accounts])

  return (
    <Grid
      container
      direction="row"
      p="0 1.025rem 0 0"
      alignItems="center"
      justifyContent="space-between"
      borderBottom={`0.025rem solid ${theme.palette.primary.main}`}
    >
      <Grid>
        <Logo
          style={{
            width: "5rem",
            height: "5rem",
            fill: theme.palette.primary.main,
            stroke: theme.palette.primary.main,
          }}
        />
      </Grid>
      <Grid size="auto">
        {pages.map((page) => (
          <MuiLink
            key={page.id}
            component={NavLink}
            to={page.path}
            sx={{
              textDecoration: "none",
              color: theme.palette.primary.main,
              marginRight: "1rem",
              borderRadius: "0.4rem",
              padding: ".125rem .5rem",
              "&.active": {
                color: "#eeeeee",
                backgroundColor: "#222222",
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
            Logout ({user.name})
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
            Sign in with Google
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default Navbar;
