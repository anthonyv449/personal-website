import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export const CustomCard = ({ imgSrc, title, description }) => {
  return (
    <Card>
      <img
        src={imgSrc}
        alt="Card image"
        style={{
          width: "100%",
          height: "auto",
          borderBottom: "1px solid var(--gray-4)",
        }}
      />
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};
