import React from "react";
import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const LoadError = ({ message = "Something went wrong. Please try again later." }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      padding={4}
    >
      <ErrorOutlineIcon fontSize="large" sx={{ color: "#e57373" }} />
      <Typography variant="h6" mt={2}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadError;
