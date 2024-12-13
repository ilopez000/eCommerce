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
} from "firebase/firestore";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const db = getFirestore();

  // Carrega els productes de Firestore
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productsData);
  };

  // Carrega les comandes de Firestore
  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const ordersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrders(ordersData);
  };

  // Afegeix un nou producte a Firestore
  const handleAddProduct = async () => {
    try {
      await addDoc(collection(db, "products"), newProduct);
      fetchProducts();
      setOpenDialog(false);
      setNewProduct({ name: "", price: "", image: "" });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Elimina un producte de Firestore
  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Panell d’Administració
      </Typography>

      {/* Gestió de Productes */}
      <Box sx={{ marginBottom: "40px" }}>
        <Typography variant="h5" gutterBottom>
          Productes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginBottom: "20px" }}
          onClick={() => setOpenDialog(true)}
        >
          Afegir Producte
        </Button>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2">Preu: €{product.price}</Typography>
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
      </Box>

      {/* Gestió de Comandes */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Comandes
        </Typography>
        {orders.map((order) => (
          <Card key={order.id} sx={{ marginBottom: "15px" }}>
            <CardContent>
              <Typography variant="body1">ID Comanda: {order.id}</Typography>
              <Typography variant="body2">
                Total: €{order.total}
              </Typography>
              <Typography variant="body2">
                Client: {order.customerName}
              </Typography>
              <Typography variant="body2">Estat: {order.status}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Diàleg per afegir producte */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Afegir Nou Producte</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom del Producte"
            fullWidth
            margin="dense"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <TextField
            label="Preu"
            type="number"
            fullWidth
            margin="dense"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <TextField
            label="URL de la Imatge"
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
            Cancel·lar
          </Button>
          <Button onClick={handleAddProduct} color="primary">
            Afegir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
