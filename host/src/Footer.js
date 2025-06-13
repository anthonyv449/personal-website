import React from "react";
import { Box, Typography, Grid2 as Grid, useTheme } from "@mui/material";


const Footer = ({latestDate}) => {
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        borderTop: `2px solid ${theme.palette.primary.main}`,
        padding: "1rem",
        marginTop: "2rem",
        backgroundColor: `${theme.palette.background.default}`,
        color: `${theme.palette.primary.textColor}`,
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
