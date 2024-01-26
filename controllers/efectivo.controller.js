const Efectivo = require("../models/efectivo.model.js");

// Create and Save a new Efectivo
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Efectivo
    const efectivo = new Efectivo({
        idefectivo: req.body.idefectivo,
        Descripcion: req.body.Descripcion,
        idmoneda: req.body.idmoneda
    });

    // Save Efectivo in the database
    Efectivo.create(efectivo, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar efectivo"
            });
        else res.send(data);
    });
};

// Retrieve all Efectivo from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idefectivo;

    Efectivo.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener efectivo"
            });
        else res.send(data);
    });
};

// Find a single efectivo with a id
exports.findOne = (req, res) => {
    Efectivo.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro efectivo con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener efectivo con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Efectivo identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Efectivo.updateById(
        req.params.id,
        new Efectivo(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found efectivo with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating efectivo with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Efectivo with the specified id in the request
exports.delete = (req, res) => {
    Efectivo.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Efectivo with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Efectivo with id " + req.params.id
                });
            }
        } else res.send({ message: `Efectivo was deleted successfully!` });
    });
};
