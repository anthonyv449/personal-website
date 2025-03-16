import React, { useState, useEffect, useCallback } from "react";
import { Box, Paper, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

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
  }, [autoPlay, interval, nextSlide]);

  return (
    <Box position="relative" width="100%" overflow="hidden">
      {children.map((child, index) => (
        <Box
          key={index}
          position="absolute"
          top={0}
          left={index === activeIndex ? 0 : "100%"}
          width="100%"
          height="100%"
          sx={{ transition: "left 0.5s ease-in-out" }}
        >
          {child}
        </Box>
      ))}
      <IconButton
        onClick={prevSlide}
        sx={{
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
        aria-label="previous slide"
      >
        <ArrowBackIos />
      </IconButton>
      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
        aria-label="next slide"
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};

// Home component that fetches image data and uses the custom Carousel
const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch the JSON file containing the image URLs and alt texts
    fetch("/GradImages/images.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch image data");
        }
        return response.json();
      })
      .then((data) => {
        setItems(data);
      })
      .catch((error) => {
        console.error("Error loading images:", error);
      });
  }, []);

  // Optionally render a loading state while fetching
  if (items.length === 0) {
    return <Box>Loading images...</Box>;
  }

  return (
    <Box my={4} color="red">
      <Carousel autoPlay interval={5000}>
        {items.map((item, index) => (
          <Paper key={index} elevation={3}>
            <img
              src={item.image}
              alt={item.alt}
              style={{ width: "100%", display: "block" }}
            />
          </Paper>
        ))}
      </Carousel>
    </Box>
  );
};

export default Home;
