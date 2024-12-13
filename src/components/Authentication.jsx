import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
} from "@mui/material";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const Authentication = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Alterna entre registre i inici de sessió
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  // Gestió del registre/inici de sessió
  const handleSubmit = async () => {
    setError(null);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUser(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUser(userCredential.user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Inici de sessió amb Google
  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  // Tancament de sessió
  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "400px",
        margin: "auto",
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      {user ? (
        // Si l'usuari ha iniciat sessió
        <Box>
          <Typography variant="h6">Benvingut, {user.email}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: "20px" }}
            onClick={handleSignOut}
          >
            Tancar Sessió
          </Button>
        </Box>
      ) : (
        // Formulari d'autenticació
        <Box>
          <Typography variant="h5" gutterBottom>
            {isSignUp ? "Registre" : "Inicia Sessió"}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ marginBottom: "20px" }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Correu Electrònic"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            label="Contrasenya"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ marginBottom: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            {isSignUp ? "Registra't" : "Inicia Sessió"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ marginTop: "15px" }}
            onClick={handleGoogleSignIn}
          >
            Inicia Sessió amb Google
          </Button>
          <Typography
            variant="body2"
            sx={{ marginTop: "20px", cursor: "pointer" }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Ja tens un compte? Inicia sessió."
              : "No tens un compte? Registra't."}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Authentication;
