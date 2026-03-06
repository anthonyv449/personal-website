import React, { useState, useEffect } from "react";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import { Carousel } from "./Carousel";
import { withHostPath } from "@anthonyv449/ui-kit";

export const MeSection = ({}) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(withHostPath("/images/images.json"))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch image data");
        }
        return response.json();
      })
      .then((data) => {
        const adjustedData = data.map((item) => ({
          ...item,
          image: item.image.startsWith("/")
            ? item.image
            : withHostPath(`/images/${item.image}`),
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
    <Grid
      container
      alignItems="center"
      spacing={6}
      sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}
    >
      <Grid size={{ xs: 12, md: 7 }}>
        <Typography variant="h1" sx={{ mb: 2 }}>
          Anthony Omar Valenzuela
        </Typography>
        <Typography
          sx={{
            color: "#9a9a98",
            fontSize: "1.1rem",
            fontWeight: 400,
            lineHeight: 1.7,
          }}
        >
          Full stack engineer. Building things, writing about what I learn.
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }} sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
        <Box
          sx={{
            width: "18rem",
            height: "18rem",
            overflow: "hidden",
            borderRadius: "0.75rem",
            border: "1px solid #2a2a2a",
            flexShrink: 0,
          }}
        >
          <Carousel autoPlay interval={5000}>
            {items.map((item, index) => (
              <Box key={index} sx={{ width: "100%", height: "100%" }}>
                <img
                  src={item.image}
                  alt={item.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}
          </Carousel>
        </Box>
      </Grid>
    </Grid>
  );
};
