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

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Resume
      </Typography>
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
          li: ({ node, ...props }) => <ListItem {...props} />,
          ul: ({ node, ...props }) => <List sx={{ pl: 4 }} {...props} />,
          ol: ({ node, ...props }) => (
            <List sx={{ pl: 4 }} component="ol" {...props} />
          ),
        }}
      >
        {resumeMarkdown}
      </ReactMarkdown>
    </Box>
  );
};

export default Resume;
