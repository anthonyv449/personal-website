import React, { useState, useEffect, useCallback } from "react";
import { Box, Paper, Grid2 as Grid, useTheme } from "@mui/material";

// Custom Carousel component
const Carousel = ({ autoPlay = true, interval = 5000, children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = children.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      nextSlide();
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, nextSlide, activeIndex]);

  return (
    <Grid>
      {children.map((child, index) => (
        <Grid
          key={index}
          position="absolute"
          left={index === activeIndex ? 0 : "100%"}
          width="25%"
          height="25%"
          sx={{ transition: "left 0.5s ease-in-out" }}
        >
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

// Home component that fetches image data and uses the custom Carousel
const Home = () => {
  const [items, setItems] = useState([]);
  const theme = useTheme();
  console.log(theme);
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
    <Grid container className="main-container">
      <Carousel autoPlay interval={5000}>
        {items.map((item, index) => (
          <Paper key={index} sx={{ height: "100%", backgroundColor: "unset" }}>
            <img
              src={item.image}
              alt={item.alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Paper>
        ))}
      </Carousel>
    </Grid>
  );
};

export default Home;
