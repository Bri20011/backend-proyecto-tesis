const Pedido_Urbanizacion = require("../models/pedido_urbanizacion.model.js");

// Create and Save a new Pedido_Urbanizacion
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Pedido_Urbanizacion
    const pedido_urbanizacion = new Pedido_Urbanizacion({
        idPedido_Urbanizacion: req.body.idPedido_Urbanizacion,
        Descripcion: req.body.Descripcion,
        Fecha_pedi: req.body.Fecha_pedi,
        Detalle: req.body.Detalle

    });

    // Save Pedido_Urbanizacion in the database
    Pedido_Urbanizacion.create(pedido_urbanizacion, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Pedido_Urbanizacion"
            });
        else res.send(data);
    });
};

// Retrieve all Pedido_Urbanizacion from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idPedido_Urbanizacion;

    Pedido_Urbanizacion.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Pedido_Urbanizacion"
            });
        else res.send(data);
    });
};

// Find a single Pedido_Urbanizacion with a id
exports.findOne = (req, res) => {
    Pedido_Urbanizacion.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro compra con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener compra con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Pedido_Urbanizacion identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Pedido_Urbanizacion.updateById(
        req.params.id,
        new Pedido_Urbanizacion(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found compra with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating compra with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Pedido_Urbanizacion with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de Pedido_Urbanizacion primero
    Pedido_Urbanizacion.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found pedido_urbanizacion with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete pedido_urbanizacion with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `pedido_urbanizacion was deleted successfully!` });
        }
    });
};