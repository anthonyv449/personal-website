import React from "react";
import { Box } from "@mui/material";
import { MeSection } from "./components/MeSection";

export const loader = async () => {
  return;
};

const Home = () => {
  return (
    <Box
      sx={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "3rem 2rem",
      }}
    >
      <MeSection />
    </Box>
  );
};

export default Home;
