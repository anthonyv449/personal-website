import React from "react";
import {
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const loader = async () => {
  //add in API calls here from store
};

const articles = [
  {
    slug: "my-first-post",
    title: "My First Post",
    summary: "Intro to my blog.",
  },
  {
    slug: "deep-dive-react",
    title: "Deep Dive into React",
    summary: "Hooks, context, etc.",
  },
];

const Writings = () => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2} padding={3}>
      {articles.map((article) => (
        <Grid key={article.slug}>
          <Card>
            <CardActionArea
              onClick={() => navigate(`/writings/${article.slug}`)}
            >
              <CardContent>
                <Typography variant="h6">{article.title}</Typography>
                <Typography variant="body2">{article.summary}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Writings;
