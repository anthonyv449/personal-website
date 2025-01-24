import React from "react";
import {
  Box,
  Grid2 as MuiGrid, // Or Grid2, depending on your MUI version
  Link,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link as RouterLink } from "react-router-dom";

function NavBar({ pages }) {
  return (
    <Box component="nav">
      <MuiGrid
        container
        alignItems="center"
        sx={{ borderBottom: "2px solid black", height: "2rem" }}
      >
        {/* Left Column */}
        <MuiGrid size={6}>
          <Typography variant="h6">valenzuela project</Typography>
        </MuiGrid>

        {/* Right (Longer) Column */}
        <MuiGrid container size={4} alignItems="center" justifyContent="center">
          {/* Use Box for horizontal spacing */}
          <MuiGrid container alignItems="center" spacing={3}>
            {pages.map((page) => (
              <Link
                key={page.id}
                component={RouterLink}
                to={page.path}
                sx={{ textDecoration: "none" }}
              >
                {page.title}
              </Link>
            ))}
          </MuiGrid>
        </MuiGrid>
        <MuiGrid size={2}>
          <TextField
            variant="standard"
            placeholder="Search..."
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </MuiGrid>
      </MuiGrid>
    </Box>
  );
}

export default NavBar;
