const Pedido = require("../models/pedido.model.js");

// Create and Save a new Pedido
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Pedido
    const pedido = new Pedido({
        idPedido: req.body.idPedido,
        Descripcion: req.body.Descripcion,
        Fecha_pedi: req.body.Fecha_pedi,
        Detalle: req.body.Detalle

    });

    // Save Pedido in the database
    Pedido.create(pedido, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Pedido"
            });
        else res.send(data);
    });
};

// Retrieve all Pedido from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idPedido;

    Pedido.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Pedido"
            });
        else res.send(data);
    });
};

// Find a single Pedido with a id
exports.findOne = (req, res) => {
    Pedido.findById(req.params.id, (err, data) => {
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


// Update a Pedido identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Pedido.updateById(
        req.params.id,
        new Pedido(req.body),
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

// Delete a Pedido with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de Pedido primero
    Pedido.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found pedido with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete pedido with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `pedido was deleted successfully!` });
        }
    });
};