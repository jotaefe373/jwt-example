const express = require("express");
const router = express.Router();
const authService = require("./authService"); // Asegúrate de tener este servicio implementado

// POST /api/auth/login (Autenticar usuario y obtener token)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await authService.login(username, password);
    res.json({ message: "Autenticación exitosa", user, token });
  } catch (error) {
    res.status(401).json({ error: error.message }); // Cambio a 401 para indicar un error de autenticación
  }
});

// POST /api/auth/register (Registrar un nuevo usuario)
router.post("/register", async (req, res) => {
  try {
    const datosUsuario = req.body; // { username: "usuario", password: "contraseña" }
    const nuevoUsuario = await authService.registrarUsuario(datosUsuario);

    // Opcional: Ocultar la contraseña en la respuesta
    const { password, ...usuarioSinPassword } = nuevoUsuario;

    res
      .status(201)
      .json({
        user: usuarioSinPassword,
        message: "Usuario registrado exitosamente",
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
