import React, { useState } from "react";
import {
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
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
const Writings = () => {
  const navigate = useNavigate();
  const { articles, createArticle } = useArticleStore();
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
      <Grid container spacing={2} padding={3}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <Grid key={article.Slug}>
              <Card>
                <CardActionArea
                  onClick={() => navigate(`/writings/${article.Slug}`)}
                  sx={{backgroundColor: "#9c27b0", ":hover": { backgroundColor: "#7b1fa2" }}}
                >
                  <CardContent>
                    <Typography variant="h6" color="white" >
                      {article.Title}
                    </Typography>
                    <Typography variant="body2" color="white">{article.Author}</Typography>
                  </CardContent>
                </CardActionArea>
               <CardContent sx={{ backgroundColor: "#f3e5f5" }}>
                  <Typography variant="body2" color="black">
                    {article.Content.slice(0, 100)}...
                  </Typography>
                </CardContent>

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
