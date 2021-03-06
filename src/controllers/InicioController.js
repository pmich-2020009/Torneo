const Entidades = require("../models/modeloEntidad");
const encriptar = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

function Admin() {
  var modeloEntidad = new Entidades();
  Entidades.find((error, administrador) => {
    if (administrador.length == 0) {
      modeloEntidad.usuario = "ADMIN";
      modeloEntidad.rol = "ADMIN";
      clave = "deportes123";
      encriptar.hash(clave, null, null, (error, claveEncriptada) => {
        modeloEntidad.password = claveEncriptada;
        modeloEntidad.save((error, administrador) => {
          if (error) console.log("Error en la peticion.");
          if (!administrador) console.log("No se pudo crear al administrador.");
          console.log("Administrador: " + administrador);
        });
      });
    } else {
      console.log(
        "Ya existe un administrador." + " Sus datos son " + administrador
      );
    }
  });
}

function Login(req, res) {
  var datos = req.body;

  Entidades.findOne({ usuario: datos.usuario }, (error, usuarioEncontrado) => {
    if (error) return res.status(500).send({ Error: "Error en la peticion." });
    if (usuarioEncontrado) {
      encriptar.compare(
        datos.password,
        usuarioEncontrado.password,
        (error, claveVerificada) => {
          if (claveVerificada) {
            if (datos.obtenerToken == "true") {
              return res
                .status(200)
                .send({ Token: jwt.crearToken(usuarioEncontrado) });
            } else {
              usuarioEncontrado.password = undefined;
              return res
                .status(200)
                .send({ Inicio_exitoso: usuarioEncontrado });
            }
          } else {
            return res.status(500).send({ Error: "La clave no coincide." });
          }
        }
      );
    }
  });
}

module.exports = {
  Admin,
  Login,
};
