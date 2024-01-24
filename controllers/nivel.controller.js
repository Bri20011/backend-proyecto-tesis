const Nivel = require("../models/nivel.model.js");

// Create and Save a new Nivel
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Nivel
    const nivel = new Nivel({
        idNivel: req.body.idNivel,
        Descripcion: req.body.Descripcion
    });

    // Save Nivel in the database
    Nivel.create(nivel, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar nivel"
            });
        else res.send(data);
    });
};

// Retrieve all Nivel from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idNivel;

    Nivel.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener nivel"
            });
        else res.send(data);
    });
};

// Find a single Nivel with a id
exports.findOne = (req, res) => {
    Nivel.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro nivel con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener nivel con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Nivel identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Nivel.updateById(
        req.params.id,
        new Nivel(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Nivel with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Nivel with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Nivel with the specified id in the request
exports.delete = (req, res) => {
    Nivel.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Nivel with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Nivel with id " + req.params.id
                });
            }
        } else res.send({ message: `Nivel was deleted successfully!` });
    });
};
