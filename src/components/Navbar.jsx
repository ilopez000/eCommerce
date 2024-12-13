import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Badge,
} from "@mui/material";
import { Search, ShoppingCart, Person } from "@mui/icons-material";

const Navbar = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: "#232f3e" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          MiTienda
        </Typography>

        {/* Search Bar */}
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

        {/* Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <IconButton color="inherit">
            <Badge badgeContent={2} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Person />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
