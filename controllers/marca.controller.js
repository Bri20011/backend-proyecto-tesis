const Marca = require("../models/marca.model.js");

// Create and Save a new Marca
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Marca
    const marca = new Marca({
        idmarca: req.body.idmarca,
        Descripcion: req.body.Descripcion
    });

    // Save Marca in the database
    Marca.create(marca, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar marca"
            });
        else res.send(data);
    });
};

// Retrieve all marca from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idmarca;

    Marca.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener marca"
            });
        else res.send(data);
    });
};

// Find a single marca with a id
exports.findOne = (req, res) => {
    Marca.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro marca con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener marca con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a marca identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Marca.updateById(
        req.params.id,
        new Marca(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Marca with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Marca with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Marca with the specified id in the request
exports.delete = (req, res) => {
    Marca.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Marca with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Marca with id " + req.params.id
                });
            }
        } else res.send({ message: `Marca was deleted successfully!` });
    });
};
