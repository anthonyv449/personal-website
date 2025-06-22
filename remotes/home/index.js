import React from "react";
import { Grid2 as Grid, Box } from "@mui/material";
import { MeSection } from "./components/MeSection";
import { Divider } from "./components/Divider";

export const loader = async () => {
  return;
};

const Home = () => {
  // Helper: Takes an array and returns a new array interspersed with dividers.
  const intersperseWithDivider = (components) => {
    components = components.flat();
    return components.reduce((acc, component, index) => {
      if (index > 0) {
        acc.push(<Divider key={`divider-${index}`} />);
      }
      acc.push(<Box key={`component-${index}`}>{component}</Box>);
      return acc;
    }, []);
  };
  const meSectionComponent = <MeSection />;

  const componentsArray = [meSectionComponent];

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
      {intersperseWithDivider(componentsArray)}
    </Grid>
  );
};

export default Home;
