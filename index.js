// Importar Express
const express = require("express");
const cors = require("cors");

const userController = require("./src/authController");

// Inicializar la aplicación Express
const app = express();

// Definir el puerto
const port = 3000;

require("dotenv").config();

// Middleware para parsear el cuerpo de las peticiones
app.use(express.json()); // Para parsear application/json
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded

// Middleware para habilitar CORS
app.use(cors());

// Ruta raíz que responde a una petición GET
app.get("/", (req, res) => {
  res.send("Hola Mundo con Express!");
});

app.use("/api/auth", userController);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
