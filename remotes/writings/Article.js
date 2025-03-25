import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useArticleStore } from "./store/useArticleStore";
import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Spinner } from "@anthonyv449/ui-kit";

export const loader = async () => {
  //add in API calls here from store
  const { loadArticles } = useArticleStore.getState();
  return loadArticles();
};
const Article = () => {
  const { slug } = useParams();
  const [markdown, setMarkdown] = useState("");
  const { articles } = useArticleStore();

  useEffect(() => {
    const article = articles.find((a) => a.slug === slug);
    if (article) {
      fetch(article.file)
        .then((res) => res.text())
        .then(setMarkdown)
        .catch((err) => console.error("Error loading markdown:", err));
    }
  }, [slug, articles]);

  const article = articles.find((a) => a.slug === slug);

  if (!article) return <Spinner></Spinner>;

  return (
    <Box padding={4}>
      <Typography variant="h3" gutterBottom>
        {article.title}
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
        {markdown}
      </ReactMarkdown>
    </Box>
  );
};

export default Article;
