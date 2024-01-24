const TipoVenta = require("../models/tipoventa.model.js");

// Create and Save a new TipoVenta
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a TipoVenta
    const tipoventa = new TipoVenta({
        idtipo_venta: req.body.idtipo_venta,
        Descripcion: req.body.Descripcion
    });

    // Save TipoVenta in the database
    TipoVenta.create(tipoventa, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar tipoventa"
            });
        else res.send(data);
    });
};

// Retrieve all TipoVenta from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idtipo_venta;

    TipoVenta.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener tipoventa"
            });
        else res.send(data);
    });
};

// Find a single TipoVenta with a id
exports.findOne = (req, res) => {
    TipoVenta.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro tipoventa con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener tipoventa con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a TipoVenta identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    TipoVenta.updateById(
        req.params.id,
        new TipoVenta(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found TipoVenta with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating TipoVenta with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a TipoVenta with the specified id in the request
exports.delete = (req, res) => {
    TipoVenta.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found TipoVenta with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete TipoVenta with id " + req.params.id
                });
            }
        } else res.send({ message: `TipoVenta was deleted successfully!` });
    });
};
