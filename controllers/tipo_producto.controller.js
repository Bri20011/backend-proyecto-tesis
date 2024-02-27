const TipoProducto = require("../models/tipo_producto.model.js");

// Create and Save a new TipoProducto
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a TipoProducto
    const tipo_producto = new TipoProducto({
        idtipo_producto: req.body.idtipo_producto,
        descripcion: req.body.descripcion
    });

    // Save TipoProducto in the database
    TipoProducto.create(tipo_producto, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar tipo_producto"
            });
        else res.send(data);
    });
};

// Retrieve all tipo_producto from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idtipo_producto;

    TipoProducto.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener tipo_producto"
            });
        else res.send(data);
    });
};

// Find a single TipoProducto with a id
exports.findOne = (req, res) => {
    TipoProducto.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro tipo_producto con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener tipo_producto con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a TipoProducto identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    TipoProducto.updateById(
        req.params.id,
        new TipoProducto(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found TipoProducto with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating TipoProducto with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a TipoProducto with the specified id in the request
exports.delete = (req, res) => {
    TipoProducto.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found TipoProducto with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete TipoProducto with id " + req.params.id
                });
            }
        } else res.send({ message: `TipoProducto was deleted successfully!` });
    });
};
