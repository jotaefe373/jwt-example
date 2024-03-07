const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("./authRepository");

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(username, password) {
    try {
      const user = await this.userRepository.obtenerUsuarioPorUsername(
        username
      );
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      console.log("Contraseña proporcionada:", password);
      console.log("Contraseña almacenada:", user.password);

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("¿Las contraseñas coinciden?", isMatch);

      if (!isMatch) {
        throw new Error("Contraseña incorrecta");
      }

      const payload = { id: user.id, username: user.username };

      // Generar el token y la fecha de expiración
      const { token, expirationDate } = this.generateToken(payload);

      const result = {
        user: {
          id: user.id,
          username: user.username,
          token,
          expirationDate,
        },
      };

      console.log("Resultado:", result);

      return result;
    } catch (error) {
      throw error;
    }
  }

  generateToken(payload) {
    // Generar el token con expiración de 1 hora
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Obtener la fecha de expiración del token
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1); // Añadir 1 hora

    // Ajustar la hora para reflejar la zona horaria de Chile (GMT-3)
    expirationDate.setHours(expirationDate.getHours() - 3);

    // Serializar la fecha de expiración a formato ISO 8601
    const expirationISOString = expirationDate.toISOString();

    return { token, expirationDate: expirationISOString };
  }

  async verificarToken(token) {
    try {
      // Verificar el token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Si la verificación es exitosa, devolver los datos decodificados
      return decoded;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // Si el token ha expirado, lanzar una excepción específica
        throw new Error("El token ha expirado");
      } else {
        // Si hay algún otro error, lanzar una excepción genérica
        throw new Error("Token inválido");
      }
    }
  }

  async registrarUsuario(datosUsuario) {
    try {
      const { username, password } = datosUsuario;
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await this.userRepository.crearUsuario({
        ...datosUsuario,
        password: hashedPassword,
      });
      console.log(user);
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
