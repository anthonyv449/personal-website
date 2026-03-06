import React, { useState } from "react";
import {
  Grid2 as Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useArticleStore } from "./store/useArticleStore";
import { useNavigate } from "react-router-dom";
import { ComingSoon, useGlobalData } from "@anthonyv449/ui-kit";

export const loader = async () => {
  const { loadArticles } = useArticleStore.getState();
  return loadArticles();
};
//writings
const Writings = () => {
  //initiate remote change
  const navigate = useNavigate();
  const { articles, createArticle, setCurrentArticleBySlug } =
    useArticleStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    slug: "",
    content: "",
  });
  const { user } = useGlobalData();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await createArticle(form);
    setOpen(false);
    setForm({ title: "", author: "", slug: "", content: "" });
  };
  const formIncomplete = Object.values(form).some((v) => v.trim() === "");

  return (
    <>
      <Grid offset={{ md: 10 }}>
        {user?.IsAdmin && (
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ mb: 2 }}
          >
            Add writing
          </Button>
        )}
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Writing</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            fullWidth
            label="Author"
            name="author"
            value={form.author}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            fullWidth
            label="Slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            fullWidth
            multiline
            minRows={5}
            label="Content"
            name="content"
            value={form.content}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={formIncomplete}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={3} padding="3rem 2rem">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Grid key={article.Slug}>
              <Card sx={{ minWidth: "280px", maxWidth: "360px" }}>
                <CardActionArea
                  onClick={() => {
                    navigate(`/writings/${article.Slug}`);
                    setCurrentArticleBySlug(article.Slug);
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    <Box
                      sx={{
                        width: "3px",
                        flexShrink: 0,
                        backgroundColor: "#81d3ef",
                        borderRadius: "3px 0 0 3px",
                      }}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {article.Title}
                      </Typography>
                      <Typography variant="body2">
                        {article.Content.slice(0, 80).replace(/#+/, "").trim()}...
                      </Typography>
                      {article.Author && (
                        <Typography variant="caption" sx={{ display: "block", mt: 1.5 }}>
                          {article.Author}
                        </Typography>
                      )}
                    </CardContent>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (
          <ComingSoon />
        )}
      </Grid>
    </>
  );
};

export default Writings;

// Trigger remote build
