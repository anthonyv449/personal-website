import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useArticleStore } from "./store/useArticleStore";
import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Spinner } from "@anthonyv449/ui-kit";
import remarkGfm from "remark-gfm";

export const loader = async () => {
  //add in API calls here from store
  const articleStore = useArticleStore.getState();
  const { currentArticle } = articleStore;
  const pathname = window.location.href;
  const url = new URL(pathname);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const slug = pathSegments.at(-1);
  let article;
  if (currentArticle == null) {
    article = await articleStore.loadArticle(slug);
  } else {
    article = currentArticle;
  }

  await articleStore.postArticleView(article);
};

const Article = () => {
  const [markdown, setMarkdown] = useState("");
  const { currentArticle } = useArticleStore();

  const article = currentArticle;
  if (!article) return <Spinner />;

  useEffect(() => {
    if (article?.Content) {
      setMarkdown(article.Content);
    }
  }, [article]);

  return (
    <Box padding={4}>
      <Typography variant="h3" gutterBottom>
        {article.Title}
      </Typography>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
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
          p: ({ node, ...props }) => <Typography variant="body1" {...props} />,
          ul: ({ node, ...props }) => (
            <Box component="ul" sx={{ pl: 4, m: 0 }} {...props} />
          ),
          li: ({ node, ...props }) => (
            <Typography
              component="li"
              variant="body1"
              sx={{ listStyleType: "disc", pl: 2, mb: 1 }}
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
          table: ({ node, ...props }) => (
            <Box
              component="table"
              sx={{
                width: "100%",
                borderCollapse: "collapse",
                my: 2,
              }}
              {...props}
            />
          ),
          thead: ({ node, ...props }) => <thead {...props} />,
          tbody: ({ node, ...props }) => <tbody {...props} />,
          tr: ({ node, ...props }) => (
            <tr style={{ borderBottom: "1px solid #444" }} {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontWeight: "bold",
                border: "1px solid #444",
              }}
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              style={{
                padding: "8px",
                border: "1px solid #444",
              }}
              {...props}
            />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </Box>
  );
};

export default Article;
