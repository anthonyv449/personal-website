import React from "react";
import { Box, Typography } from "@mui/material";
import UpcomingIcon from "@mui/icons-material/Upcoming";

const ContentComingSoon = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={4}
    >
      {" "}
      <UpcomingIcon fontSize="large" sx={{ color: "#b4b4b4" }} />{" "}
      <Typography variant="h6" mt={2}>
        {" "}
        Content Coming Soon{" "}
      </Typography>{" "}
    </Box>
  );
};

export default ContentComingSoon;
