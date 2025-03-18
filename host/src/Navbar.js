import React, { useContext } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";

const Navbar = ({ pages }) => {
  const theme = useTheme();
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
      {/* Left Side - Brand Name */}
      <Typography
        variant="h6"
        sx={{
          flexGrow: 1,
          fontWeight: "bold",
        }}
      >
        Ant Val
      </Typography>

      {/* Right Side - Navigation Links */}
      <Box sx={{ display: "flex", gap: "1.025rem" }}>
        {pages.map((page) => (
          <NavLink
            key={page.id}
            to={page.path}
            style={({ isActive }) => ({
              background: isActive
                ? "#222222"
                : theme.palette.background.default,
              color: isActive ? "#eeeeee" : theme.palette.primary,
            })}
          >
            {page.title}
          </NavLink>
        ))}
      </Box>
    </Box>
  );
};

export default Navbar;
