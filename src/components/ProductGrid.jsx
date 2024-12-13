import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { fetchProducts } from "../services/productService";
import { getAuth } from "firebase/auth";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51QSgAiBNoAIrMHfdrqMMFCgqvBXCJ9ymEpmjB0u8QzZUfrkNRN3DU1FEtI5Pe63YEgz5T3FwmpOvHpuR9hzGn0op00jZoKkROE");

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const auth = getAuth();

  // Verifica si l'usuari és un venedor
  useEffect(() => {
    const checkSellerRole = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await fetch(
          `https://firestore.googleapis.com/v1/projects/ecommerce-521ca/databases/(default)/documents/users/${currentUser.uid}`
        );
        const userData = await userDoc.json();
        setIsSeller(userData.fields.role.stringValue === "seller");
      }
    };

    checkSellerRole();
  }, [auth]);

  // Carrega productes
  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };

    loadProducts();
  }, []);

  // Gestió de compra directa
  const handleBuyNow = async (product) => {
    const stripe = await stripePromise;

    try {
      const response = await fetch("http://localhost:3001/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              name: product.name,
              price: product.price,
              quantity: 1,
            },
          ],
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`,
        }),
      });

      const { sessionId } = await response.json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error al processar el pagament:", error);
      alert("No s'ha pogut completar el pagament.");
    }
  };

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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Productes disponibles
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
 
            <Card>
              {/* Comprova que `product.image` existeix abans d'usar-lo */}
              <CardMedia
                component="img"
                height="200"
                image={product.imageURL || "https://via.placeholder.com/200"} // Mostra una imatge de reserva si falta la URL
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Link
                  to={`/product/${product.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                <Typography variant="h6">{product.name}</Typography>
                </Link>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" sx={{ marginTop: "10px" }}>
                  €{product.price}
                </Typography>
                {isSeller ? (
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ marginTop: "10px" }}
                  >
                    Ets el propietari d'aquest producte.
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBuyNow(product)}
                    sx={{ marginTop: "10px" }}
                  >
                    Comprar ara
                  </Button>
                )}
              </CardContent>
            </Card>
            
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid;
