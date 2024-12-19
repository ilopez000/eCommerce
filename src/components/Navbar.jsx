import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Badge,
  Link,
  Button,
} from "@mui/material";
import { Search, ShoppingCart } from "@mui/icons-material";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [user, setUser] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [temperature, setTemperature] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  // Actualiza la hora cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Obtiene la temperatura actual usando OpenWeather API
  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Barcelona&units=metric&appid=15b7fe0cfea4a4cbe609f96b2e97e96e`
        );
        const data = await response.json();
        setTemperature(data.main.temp); // Actualiza la temperatura
      } catch (error) {
        console.error("Error obteniendo la temperatura:", error);
      }
    };
    fetchTemperature();
  }, []);

  // Comprueba si el usuario tiene rol de vendedor
  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.currentUser;
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "User", currentUser.uid));
          if (userDoc.exists() && userDoc.data().role === "seller") {
            setIsSeller(true);
          } else {
            setIsSeller(false);
          }
        } catch (error) {
          console.error("Error accediendo al documento Firestore:", error);
          setIsSeller(false);
        }
      }
    };

    auth.onAuthStateChanged(() => {
      checkAuth();
    });
  }, [auth, db]);

  // Cierra sesión
  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setIsSeller(false);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#232f3e" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          <Link
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Mi Tienda
          </Link>
        </Typography>

        {/* Barra de búsqueda */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "5px",
            padding: "0 10px",
            width: "40%",
          }}
        >
          <Search style={{ color: "#888" }} />
          <InputBase
            placeholder="Buscar productos"
            style={{
              marginLeft: "10px",
              flex: 1,
              fontSize: "14px",
            }}
          />
        </div>

        {/* Hora y temperatura */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "white" }}>
          <Typography variant="body1">{time}</Typography>
          {temperature !== null && (
            <Typography variant="body1">{`${temperature}°C`}</Typography>
          )}
        </div>

        {/* Íconos y enlaces */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {isSeller && (
            <Link
              href="/admin-dashboard"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Tauler de Venedor
            </Link>
          )}
          <IconButton color="inherit">
            <Badge badgeContent={2} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          {user ? (
            <Button
              color="inherit"
              onClick={handleSignOut}
              style={{ fontWeight: "bold" }}
            >
              Tanca Sessió
            </Button>
          ) : (
            <Link
              href="/authentication"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Inicia Sessió
            </Link>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
