import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importa el Router
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import ProductDetails from "./components/ProductDetails"; // Importa la página de detalles
import { Box, CssBaseline } from "@mui/material";

const Success = () => <h1>Pagament completat!</h1>;
const Cancel = () => <h1>El pagament s'ha cancel·lat.</h1>;
const App = () => {
  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Assegura que el Footer sempre quedi al final
        }}
      >
        {/* CssBaseline assegura un estil consistent */}
        <CssBaseline />
        {/* Barra de navegació */}
        <Navbar />
        {/* Configuració de rutes */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner />
                <ProductGrid />
              </>
            }
          />

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
        </Routes>
        {/* Peu de pàgina */}
        <Footer />
      </Box>
    </Router>
    
  );
};

export default App;
