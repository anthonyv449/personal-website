import React from "react";
import { Box } from "@mui/material";

export const Divider = () => {
  return (
    <Box
      sx={(theme) => ({
        width: "75%",
        borderTop: `0.125rem solid ${theme.palette.greys.default}`, // Use theme color
        margin: "0.625rem auto",
      })}
    />
  );
};
