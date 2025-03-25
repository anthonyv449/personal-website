import React from "react";
import { Box, Typography, Grid2 as Grid } from "@mui/material";

const Footer = () => {
  const latestReleaseDate = "March 25, 2025"; // You can dynamically update this later

  return (
    <Box
      component="footer"
      sx={{
        borderTop: "2px solid #b4b4b4",
        padding: "1rem",
        marginTop: "2rem",
        backgroundColor: "#111210",
        color: "#b4b4b4",
      }}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid>
          <Typography variant="body2">
            Latest Release: {latestReleaseDate}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
