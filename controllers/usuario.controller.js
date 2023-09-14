const Usuario = require("../models/usuario.model.js");

// Create and Save a new Usuario
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Usuario
    const usuario = new Usuario({
        idUsuario: req.body.idUsuario,
        Nombre: req.body.Nombre,
        Contrasehna: req.body.Contrasehna
    });

    // Save Usuario in the database
    Usuario.create(usuario, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar usuario"
            });
        else res.send(data);
    });
};

// Retrieve all Usuario from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idUsuario;

    Usuario.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener usuario"
            });
        else res.send(data);
    });
};

// Find a single Usuario with a id
exports.findOne = (req, res) => {
    Usuario.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro usuario con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener usuario con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Usuario identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Usuario.updateById(
        req.params.id,
        new Usuario(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Usuario with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Usuario with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Usuario with the specified id in the request
exports.delete = (req, res) => {
    Usuario.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Usuario with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Usuario with id " + req.params.id
                });
            }
        } else res.send({ message: `Usuario was deleted successfully!` });
    });
};
