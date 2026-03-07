import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Spinner, LoadError, ComingSoon } from "@anthonyv449/ui-kit";
import { useBookStore } from "./store/useBookStore";

export const loader = async () => {
  const bookStore = useBookStore.getState();
  if (bookStore.books.length === 0 && !bookStore.empty && !bookStore.error) {
    await bookStore.loadBooks();
  }
};

function Books() {
  const { books, currentIndex, nextBook, prevBook, error, empty } = useBookStore();

  useEffect(() => {
    if (books.length === 0 && !empty && !error) {
      useBookStore.getState().loadBooks();
    }
  }, []);

  if (error) return <LoadError />;
  if (empty) return <ComingSoon />;
  if (books.length === 0) return <Spinner />;

  const book = books[currentIndex];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        gap: 3,
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <Typography variant="h2">Books</Typography>

      <Card sx={{ width: "100%" }}>
        <CardContent sx={{ padding: 4 }}>
          <Typography variant="h3" gutterBottom>
            {book.Title}
          </Typography>
          {book.Author && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              by {book.Author}
            </Typography>
          )}
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {book.Snippet}
          </Typography>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <IconButton onClick={prevBook} aria-label="Previous book">
          <ArrowBackIosNewIcon />
        </IconButton>

        <Typography variant="body2">
          {currentIndex + 1} / {books.length}
        </Typography>

        <IconButton onClick={nextBook} aria-label="Next book">
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={nextBook}>
          Skip
        </Button>
        <Button
          variant="contained"
          component={Link}
          href={book.PurchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewIcon />}
        >
          Purchase Book
        </Button>
      </Box>
    </Box>
  );
}

export default Books;
