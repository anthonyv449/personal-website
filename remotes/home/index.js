import React from "react";
import { Grid2 as Grid, Box, Typography } from "@mui/material";
import { MeSection } from "./components/MeSection";
import { Divider } from "./components/Divider";
const Home = () => {
  const renderWithDividers = (...components) => {
    return components.flatMap((component, index) =>
      index === components.length - 1
        ? [component]
        : [component, <Divider key={`divider-${index}`} />]
    );
  };
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
      {renderWithDividers(<MeSection></MeSection>, <Typography>hi</Typography>)}
    </Grid>
  );
};

export default Home;
