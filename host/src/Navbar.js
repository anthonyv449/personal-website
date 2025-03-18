import React from "react";
import { Box, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { Grid2 as Grid } from "@mui/material";

const Navbar = ({ pages }) => {
  const theme = useTheme();
  return (
    <Grid
      container
      spacing={3}
      direction="row"
      p="0 1.025rem"
      alignItems="center"
    >
      <Grid size={10}>
        <Logo
          style={{
            width: "2rem",
            height: "2rem",
            fill: theme.palette.primary.main,
            stroke: theme.palette.primary.main,
          }}
        />
      </Grid>
      <Grid size={2} sx={{ display: "flex", gap: "1.025rem" }}>
        {pages.map((page) => (
          <NavLink
            key={page.id}
            to={page.path}
            style={({ isActive }) => ({
              color: isActive ? "#eeeeee" : theme.palette.primary,
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
