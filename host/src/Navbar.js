import React from "react";
import { Box, useTheme, Grid2 as Grid } from "@mui/material";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.svg";

const Navbar = ({ pages }) => {
  const theme = useTheme();
  return (
    <Grid
      container
      direction="row"
      p="0 1.025rem 0 0"
      alignItems="center"
      borderBottom={`0.025rem solid ${theme.palette.primary.main}`}
    >
      <Grid size={9}>
        <Logo
          style={{
            width: "2rem",
            height: "2rem",
            fill: theme.palette.primary.main,
            stroke: theme.palette.primary.main,
          }}
        />
      </Grid>
      <Grid size="auto">
        {pages.map((page) => (
          <NavLink
            key={page.id}
            to={page.path}
            style={({ isActive }) => ({
              color: isActive ? "#eeeeee" : theme.palette.primary.main,
              background: isActive
                ? "#222222"
                : theme.palette.background.default,
              borderRadius: "0.4rem",
              padding: ".125rem .5rem",
              textDecoration: "none",
            })}
          >
            {page.title}
          </NavLink>
        ))}
      </Grid>
    </Grid>
  );
};

export default Navbar;
