const Barrio = require("../models/barrio.model.js");

// Create and Save a new Barrio
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Barrio
    const barrio = new Barrio({
        idBarrio: req.body.idBarrio,
        descripcion: req.body.descripcion
    });

    // Save Barrio in the database
    Barrio.create(barrio, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar barrio"
            });
        else res.send(data);
    });
};

// Retrieve all Barrio from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idBarrio;

    Barrio.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener barrio"
            });
        else res.send(data);
    });
};

// Find a single barrio with a id
exports.findOne = (req, res) => {
    Barrio.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro Barrio con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener barrio con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Barrio identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Barrio.updateById(
        req.params.id,
        new Barrio(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Barrio with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Barrio with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Barrio with the specified id in the request
exports.delete = (req, res) => {
    Barrio.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Barrio with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Barrio with id " + req.params.id
                });
            }
        } else res.send({ message: `Barrio was deleted successfully!` });
    });
};
