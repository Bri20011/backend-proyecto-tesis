const Presupuesto = require("../models/presupuesto.model.js");

// Create and Save a new Presupuesto
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Presupuesto
    const presupuesto = new Presupuesto({
        idPresupuesto: req.body.idPresupuesto,
        Descripcion: req.body.Descripcion,
        Fecha_pedi: req.body.Fecha_pedi,
        Precio: req.body.Precio,
        Detalle: req.body.Detalle

    });

    // Save Presupuesto in the database
    Presupuesto.create(presupuesto, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Presupuesto"
            });
        else res.send(data);
    });
};

// Retrieve all Presupuesto from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idPresupuesto;

    Presupuesto.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Presupuesto"
            });
        else res.send(data);
    });
};

// Find a single Presupuesto with a id
exports.findOne = (req, res) => {
    Presupuesto.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro Presupuesto con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener Presupuesto con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Presupuesto identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Presupuesto.updateById(
        req.params.id,
        new Presupuesto(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found presupuesto with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating presupuesto with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Presupuesto with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de Presupuesto primero
    Presupuesto.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found presupuesto with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete presupuesto with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `presupuesto was deleted successfully!` });
        }
    });
};