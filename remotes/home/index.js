import React from "react";
import { Grid2 as Grid } from "@mui/material";
import { MeSection } from "./components/MeSection";
const Home = () => {
  return (
    <Grid
      container
      spacing={2}
      direction="column"
      sx={{
        marginRight: "10rem",
        marginLeft: "10rem",
      }}
    >
      <MeSection></MeSection>
    </Grid>
  );
};

export default Home;
