const Usuario = require("../models/usuario.model.js");

// Autenticar usuario
exports.login = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Obtener datos del Usuario
    const usuario = new Usuario({
        Nombre: req.body.user,
        Contrasehna: req.body.password
    });

    // Buscar el usuario
    Usuario.findByUserAndPassword(usuario, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Usuario incorrecto"
            });
        else {
            res.send({
                token: 'El usuario es autorizado'
            });
        }  
    });
};

