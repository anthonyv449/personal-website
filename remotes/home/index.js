import React from "react";
import { Grid2 as Grid, Box } from "@mui/material";
import { MeSection } from "./components/MeSection";
import { Divider } from "./components/Divider";
import { CustomCard } from "./components/Card";
import { useImageStore } from "./stores/useImageStore"; // adjust path as needed

export const loader = async () => {
  const { loadArticleImages } = useImageStore.getState();
  return await loadArticleImages();
};

const Home = () => {
  const { articleImages } = useImageStore();
  console.log(articleImages);

  // Helper: Takes an array and returns a new array interspersed with dividers.
  const intersperseWithDivider = (components) => {
    return components.reduce((acc, component, index) => {
      if (index > 0) {
        acc.push(<Divider key={`divider-${index}`} />);
      }
      acc.push(<Box key={`component-${index}`}>{component}</Box>);
      return acc;
    }, []);
  };

  const meSectionComponent = <MeSection />;
  // Map articleImages to CustomCard components
  const cardComponents = articleImages.map((image, index) => (
    <CustomCard
      key={index}
      imgSrc={image.image}
      title={image.title}
      description={image.description}
    />
  ));

  // Combine MeSection and all card components into a single array
  const componentsArray = [meSectionComponent, ...cardComponents];

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
