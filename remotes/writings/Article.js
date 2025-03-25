import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useArticleStore } from "./store/useArticleStore";
import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Spinner } from "@anthonyv449/ui-kit";

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
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </Box>
  );
};

export default Article;
