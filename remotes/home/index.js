import React, { useState, useEffect } from "react";
import { Grid2 as Grid, Box, Typography } from "@mui/material";
import { MeSection } from "./components/MeSection";
import { Divider } from "./components/Divider";
import { CustomCard } from "./components/Card";
const Home = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch("/GradImages/articleImages.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch image data");
        }
        return response.json();
      })
      .then((data) => {
        // Adjust image path if needed
        const adjustedData = data.map((item) => ({
          ...item,
          image: item.image.startsWith("/")
            ? item.image
            : `/GradImages/${item.image}`,
        }));
        setItems(adjustedData);
      })
      .catch((error) => {
        console.error("Error loading images:", error);
      });
  }, []);
  console.log(items);
  const renderWithDividers = (...components) => {
    return components
      .flatMap((component, index) => [
        React.isValidElement(component) ? (
          <Box key={`component-${index}`}>{component}</Box>
        ) : (
          <Box>NotValid</Box>
        ),
        index !== components.length - 1 && <Divider key={`divider-${index}`} />,
      ])
      .filter(Boolean);
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
      {renderWithDividers(
        <MeSection></MeSection>,
        <CustomCard
          imgSrc={items.length > 0 ? items[0].image : ""}
          title="GOAT PIC"
          description="a real live goat"
        ></CustomCard>
      )}
    </Grid>
  );
};

export default Home;
