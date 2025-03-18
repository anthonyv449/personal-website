import React from "react";
import { Box, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { Grid2 as Grid } from "@mui/material";

const Navbar = ({ pages }) => {
  const theme = useTheme();
  console.log(theme);
  return (
    <Box
      component="nav"
      sx={{
        height: "3rem",
        display: "flex",
        alignItems: "center",
        padding: "0 1.025rem",
      }}
    >
      <Grid container spacing={3} direction="row">
        <Box>
          <Logo
            style={{
              width: "2rem",
              height: "2rem",
              fill: theme.palette.primary.main,
              stroke: theme.palette.primary.main,
            }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: "1.025rem" }}>
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
        </Box>
      </Grid>
    </Box>
  );
};

export default Navbar;
