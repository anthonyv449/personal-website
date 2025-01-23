// NavBar.js
import { Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function Navbar({ pages }) {
  return (
    <Box component={<nav />}>
      {pages.map((page) => (
        <Link key={page.id} to={page.path} style={{ margin: "10px" }}>
          {page.title}
        </Link>
      ))}
    </Box>
  );
}

export default Navbar;
