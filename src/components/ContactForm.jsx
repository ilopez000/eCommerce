import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:3001/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSuccess(true);
      } else {
        console.error("Error enviando el formulario");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: "600px", margin: "auto", padding: "20px" }}
    >
      <Typography variant="h4" gutterBottom>
        Contacta con Nosotros
      </Typography>
      {success && <Alert severity="success">Mensaje enviado con éxito!</Alert>}
      <TextField
        label="Nombre"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
        sx={{ marginBottom: "15px" }}
      />
      <TextField
        label="Correo Electrónico"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
        sx={{ marginBottom: "15px" }}
      />
      <TextField
        label="Asunto"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        fullWidth
        required
        sx={{ marginBottom: "15px" }}
      />
      <TextField
        label="Mensaje"
        name="message"
        value={formData.message}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        required
        sx={{ marginBottom: "15px" }}
      />
      <Button variant="contained" type="submit" color="primary" fullWidth>
        Enviar
      </Button>
    </Box>
  );
};

export default ContactForm;
