import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const articleContent = {
  "my-first-post": {
    title: "My First Post",
    body: "Welcome to my first article...",
  },
  "deep-dive-react": {
    title: "Deep Dive into React",
    body: "React hooks, context, and more...",
  },
};

const Article = () => {
  const { slug } = useParams();
  const article = articleContent[slug];

  if (!article) return <Typography>Article not found.</Typography>;

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        {article.title}
      </Typography>
      <Typography variant="body1">{article.body}</Typography>
    </Box>
  );
};

export default Article;
