import React, { useState, useEffect } from "react";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import { Carousel } from "./Carousel";
import { withHostPath } from "@anthonyv449/ui-kit";
export const MeSection = ({}) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(withHostPath("/GradImages/images.json"))
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
            : withHostPath(`/GradImages/${item.image}`),
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
    <Grid container alignItems="center" direction="column" spacing={2}>
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
      <Grid xs={6} height="10rem" width="10rem" overflow="hidden">
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
