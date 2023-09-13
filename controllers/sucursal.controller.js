const Sucursal = require("../models/sucursal.model.js");

// Create and Save a new Sucursal
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Sucursal
    const sucursal = new Sucursal({
        idSucursal: req.body.idSucursal,
        Descripcion: req.body.Descripcion
    });

    // Save Sucursal in the database
    Sucursal.create(sucursal, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar sucursal"
            });
        else res.send(data);
    });
};

// Retrieve all Sucursal from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idSucursal;

    Sucursal.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener sucursal"
            });
        else res.send(data);
    });
};

// Find a single Sucursal with a id
exports.findOne = (req, res) => {
    Sucursal.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro sucursal con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener sucursal con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Sucursal identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Sucursal.updateById(
        req.params.id,
        new Sucursal(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Sucursal with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Sucursal with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Sucursal with the specified id in the request
exports.delete = (req, res) => {
    Sucursal.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Sucursal with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Sucursal with id " + req.params.id
                });
            }
        } else res.send({ message: `Sucursal was deleted successfully!` });
    });
};
