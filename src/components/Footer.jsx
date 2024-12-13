import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#232f3e",
        color: "white",
        padding: "20px",
        textAlign: "center",
        marginTop: "auto",
      }}
    >
      {/* Missatge principal */}
      <Typography variant="body1" sx={{ marginBottom: "10px" }}>
        © 2024 MiTienda. Tots els drets reservats.
      </Typography>
      
      {/* Enllaços */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
        <Link
          href="#"
          underline="hover"
          sx={{ color: "white", fontSize: "14px" }}
        >
          Política de Privadesa
        </Link>
        <Link
          href="#"
          underline="hover"
          sx={{ color: "white", fontSize: "14px" }}
        >
          Condicions d'Ús
        </Link>
        <Link
          href="#"
          underline="hover"
          sx={{ color: "white", fontSize: "14px" }}
        >
          Contacte
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;