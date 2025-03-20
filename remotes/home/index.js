import React, { useState, useEffect } from "react";
import { Box, Grid2 as Grid, Typography, Paper } from "@mui/material";
import { Carousel } from "./components/Carousel";

// Home component that fetches image data and uses the custom Carousel
const Home = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch("/GradImages/images.json")
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

  if (items.length === 0) {
    return <Box>Loading images...</Box>;
  }

  return (
    <Grid container spacing={2} direction="row">
      <Grid xs={6}>
        <Box>
          <Typography className="header">Anthony Omar Valenzuela</Typography>
          <Typography className="paragraph">
            I'm a full stack software engineer looking to learn. I'll be posting
            my personal projects, and self-written articles about topics I find
            interesting.
          </Typography>
        </Box>
      </Grid>
      <Grid xs={6} minHeight="10rem" minWidth="10rem" overflow="hidden">
        <Carousel autoPlay interval={5000}>
          {items.map((item, index) => (
            <Box key={index}>
              <img
                src={item.image}
                alt={item.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          ))}
        </Carousel>
      </Grid>
    </Grid>
  );
};

export default Home;
