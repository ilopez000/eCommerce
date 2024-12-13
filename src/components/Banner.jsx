import React from "react";
import { Box, Typography } from "@mui/material";

const Banner = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "400px",
        backgroundImage: `url('https://via.placeholder.com/1500x400')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        ¡Explora nuestras ofertas exclusivas!
      </Typography>
    </Box>
  );
};

export default Banner;
