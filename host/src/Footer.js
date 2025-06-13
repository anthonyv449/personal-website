import React from "react";
import { Box, Typography, Grid2 as Grid } from "@mui/material";
 

const Footer = ({latestDate}) => {
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
            Latest Release: {latestDate.toLocaleDateString("en-US")}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
