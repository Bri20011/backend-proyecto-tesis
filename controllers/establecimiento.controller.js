const Establecimiento = require("../models/establecimiento.model.js");

// Create and Save a new Establecimiento
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Establecimiento
    const establecimiento = new Establecimiento({
        idEstablecimiento: req.body.idEstablecimiento,
        Descripcion: req.body.Descripcion,
        Numero_establec: req.body.Numero_establec
    });

    // Save Establecimiento in the database
    Establecimiento.create(establecimiento, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar establecimiento"
            });
        else res.send(data);
    });
};

// Retrieve all Establecimiento from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idEstablecimiento;

    Establecimiento.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener establecimiento"
            });
        else res.send(data);
    });
};

// Find a single Establecimiento with a id
exports.findOne = (req, res) => {
    Establecimiento.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro establecimiento con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener establecimiento con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Establecimiento identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Establecimiento.updateById(
        req.params.id,
        new Establecimiento(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Establecimiento with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Establecimiento with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Establecimiento with the specified id in the request
exports.delete = (req, res) => {
    Establecimiento.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Establecimiento with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Establecimiento with id " + req.params.id
                });
            }
        } else res.send({ message: `Establecimiento was deleted successfully!` });
    });
};
