import React from "react";
import { Box, Grid2 as Grid, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function NavBar({ pages }) {
  return (
    <Box component="nav">
      <Grid
        container
        direction="row"
        justifyContent="center" // Centers the entire row horizontally
        alignItems="center"
        spacing={30}
        sx={{ borderBottom: "2px solid black", height: "2rem" }}
      >
        <Grid
          item
          xs={4}
          sx={{ display: "flex", alignItems: "center", gap: 2, paddingX: 2 }}
        >
          {pages.map((page) => (
            <Link
              key={page.id}
              component={RouterLink}
              to={page.path}
              sx={{ textDecoration: "none" }}
            >
              {page.title}
            </Link>
          ))}
        </Grid>

        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">valenzuela project</Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 2,
            paddingX: 2,
          }}
        >
          {pages.map((link) => (
            <Link
              key={link.id}
              component={RouterLink}
              to={link.path}
              sx={{ textDecoration: "none" }}
            >
              {link.title}
            </Link>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default NavBar;
