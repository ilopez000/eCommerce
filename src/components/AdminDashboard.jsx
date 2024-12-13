import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });
  const [isSeller, setIsSeller] = useState(false);
  const db = getFirestore();
  const auth = getAuth();

  // Verifica si el usuario tiene rol de vendedor
  useEffect(() => {
    const checkSellerRole = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDocs(doc(db, "User", currentUser.uid));
        if (userDoc.exists() && userDoc.data().role === "seller") {
          setIsSeller(true);
        } else {
          setIsSeller(false);
        }
      }
    };

    checkSellerRole();
  }, [auth, db]);

  // Carga los productos asociados al vendedor
  const fetchProducts = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const sellerId = currentUser.uid;
    const productsQuery = query(
      collection(db, "Products"),
      where("sellerId", "==", sellerId)
    );

    const querySnapshot = await getDocs(productsQuery);
    const productsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productsData);
  };

  // Añade un nuevo producto
  const handleAddProduct = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      await addDoc(collection(db, "Products"), {
        ...newProduct,
        sellerId: currentUser.uid, // Asocia el producto al vendedor
      });
      fetchProducts();
      setOpenDialog(false);
      setNewProduct({ name: "", price: "", image: "" });
    } catch (error) {
      console.error("Error añadiendo producto:", error);
    }
  };

  // Elimina un producto
  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "Products", id));
      fetchProducts();
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };

  // Carga inicial de productos
  useEffect(() => {
    fetchProducts();
  }, [auth]);

  // Si no es vendedor, muestra un mensaje de error
  if (!isSeller) {
    return (
      <Box sx={{ textAlign: "center", padding: "50px" }}>
        <Typography variant="h6">
          No tienes permisos para acceder a este panel.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Panel de Productos
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ marginBottom: "20px" }}
        onClick={() => setOpenDialog(true)}
      >
        Añadir Producto
      </Button>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">Precio: €{product.price}</Typography>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ marginTop: "10px" }}
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo para añadir un nuevo producto */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Añadir Nuevo Producto</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre del Producto"
            fullWidth
            margin="dense"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <TextField
            label="Precio"
            type="number"
            fullWidth
            margin="dense"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <TextField
            label="URL de la Imagen"
            fullWidth
            margin="dense"
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddProduct} color="primary">
            Añadir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
