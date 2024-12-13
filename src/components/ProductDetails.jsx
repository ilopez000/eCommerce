import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig"; // Importa la configuración de Firestore
import { doc, getDoc } from "firebase/firestore";

const ProductDetails = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "products", id); // Cambia "products" por el nombre de tu colección
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          console.log("No se encontró el producto.");
        }
      } catch (error) {
        console.error("Error obteniendo los datos del producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Carregant informació del producte...</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">No s'ha trobat el producte.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <Grid container spacing={4}>
        {/* Imatge del producte */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
              sx={{ height: "400px", objectFit: "contain" }}
            />
          </Card>
        </Grid>

        {/* Informació del producte */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Preu: {product.price} €
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product.description}
            </Typography>
            <Box sx={{ marginTop: "20px", display: "flex", gap: "15px" }}>
              <Button variant="contained" color="primary">
                Afegir al carretó
              </Button>
              <Button variant="outlined" color="secondary">
                Comprar ara
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;
