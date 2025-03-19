import React, { useState, useEffect, useCallback } from "react";
import { Box, useTheme } from "@mui/material";

// Custom Carousel component
export const Carousel = ({ autoPlay = true, interval = 5000, children }) => {
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
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {children.map((child, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: 0,
            left: index === activeIndex ? 0 : "100%",
            width: "100%",
            height: "100%",
            transition: "left 0.5s ease-in-out",
          }}
        >
          {child}
        </Box>
      ))}
    </Box>
  );
};
