const Orden_Compra_Urbanizacion = require("../models/orde_compra_lote.model.js");

// Create and Save a new Orden_Compra_Urbanizacion
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Orden_Compra_Urbanizacion
    const orde_compra_lote = new Orden_Compra_Urbanizacion({
        idorde_compra_lote: req.body.idorde_compra_lote,
        descripcion: req.body.descripcion,
        fecha: req.body.fecha,
        Detalle: req.body.Detalle

    });

    // Save Orden_Compra_Urbanizacion in the database
    Orden_Compra_Urbanizacion.create(orde_compra_lote, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Orden_Compra_Urbanizacion"
            });
        else res.send(data);
    });
};

// Retrieve all Orden_Compra_Urbanizacion from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idorde_compra_lote;

    Orden_Compra_Urbanizacion.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Orden_Compra_Urbanizacion"
            });
        else res.send(data);
    });
};

// Find a single Orden_Compra_Urbanizacion with a id
exports.findOne = (req, res) => {
    Orden_Compra_Urbanizacion.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro Orden_Compra con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener Orden_Compra con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Orden_Compra_Urbanizacion identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Orden_Compra_Urbanizacion.updateById(
        req.params.id,
        new Orden_Compra_Urbanizacion(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found orde_compra_lote with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating orde_compra_lote with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Orden_Compra_Urbanizacion with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de Orden_Compra_Urbanizacion primero
    Orden_Compra_Urbanizacion.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found orde_compra_lote with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete orde_compra_lote with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `orde_compra_lote was deleted successfully!` });
        }
    });
};