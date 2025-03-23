import React from "react";
import { Box, Button, Typography, Grid2 as Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const latestReleaseDate = "March 1, 2025"; // You can dynamically update this later

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
        <Grid>
          <Button
            component={RouterLink}
            to="/imprint"
            sx={{ color: "#b4b4b4", marginRight: 2 }}
          >
            Imprint
          </Button>
          <Button
            component={RouterLink}
            to="/privacypolicy"
            sx={{ color: "#b4b4b4" }}
          >
            Privacy Policy
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
