// repositories/userRepository.js
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

class UserRepository {
  constructor() {
    this.dbPath = path.join(__dirname, "../db.json"); // Asegúrate de tener la ruta correcta
  }

  obtenerUsuarios() {
    const data = fs.readFileSync(this.dbPath);
    return JSON.parse(data).users;
  }

  obtenerUsuarioPorUsername(username) {
    const users = this.obtenerUsuarios();
    return users.find((user) => user.username === username);
  }

  async crearUsuario(datosUsuario) {
    const users = this.obtenerUsuarios();
    const newUser = {
      ...datosUsuario,
      id: users.length + 1,
    };
    users.push(newUser);
    fs.writeFileSync(this.dbPath, JSON.stringify({ users }, null, 2));
    return newUser;
  }
}

module.exports = UserRepository;
