import React from "react";
import {
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";
import { useArticleStore } from "./store/useArticleStore";
import { useNavigate } from "react-router-dom";
import { ComingSoon } from "@anthonyv449/ui-kit";

export const loader = async () => {
  //add in API calls here from store
  const { loadArticles } = useArticleStore.getState();
  return loadArticles();
};
const Writings = () => {
  const navigate = useNavigate();
  const { articles } = useArticleStore();
  console.log(articles);

  return (
    <Grid container spacing={2} padding={3}>
      {articles.length > 0 ? (
        articles.map((article) => (
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
        ))
      ) : (
        <ComingSoon />
      )}
    </Grid>
  );
};

export default Writings;
