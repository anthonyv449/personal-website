import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Typography, Box, List, ListItem } from "@mui/material";
import { useResumeStore } from "./store/useResumeStore";

export const loader = async () => {
  const { fetchResume } = useResumeStore.getState();
  return fetchResume();
};
  //testing version increase

const Resume = () => {
  const { resumeMarkdown } = useResumeStore();
  //change
  return (
    <Box sx={{ padding: 4 }}>
      <ReactMarkdown
  components={{
    h1: ({ node, ...props }) => (
            <Typography variant="h4" gutterBottom {...props} />
          ),
    h2: ({ node, ...props }) => (
      <Typography variant="h5" gutterBottom {...props} />
    ),
    h3: ({ node, ...props }) => (
      <Typography variant="h6" gutterBottom {...props} />
    ),
    p: ({ node, ...props }) => (
      <Typography variant="body1" paragraph {...props} />
    ),
    ul: ({ node, ...props }) => (
      <Box component="ul" sx={{ pl: 4, m: 0 }} {...props} />
    ),
    li: ({ node, ...props }) => (
      <Typography
        component="li"
        variant="body1"
        sx={{
          listStyleType: "disc",
          pl: 2,
          mb: 1,
        }}
        {...props}
      />
    ),
    strong: ({ node, ...props }) => (
      <Typography
        component="span"
        sx={{ fontWeight: "bold", display: "inline" }}
        {...props}
      />
    ),
  }}
>
  {resumeMarkdown}
</ReactMarkdown>
    </Box>
  );
};

export default Resume;
