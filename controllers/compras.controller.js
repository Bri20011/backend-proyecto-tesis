const Compras = require("../models/compras.model.js");

// Create and Save a new Compras
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Compras
    const compras = new Compras({
        idCompras: req.body.idCompras,
        Fecha_doc: req.body.Fecha_doc,
        Timbrado: req.body.Timbrado,
        Numero_fact: req.body.Numero_fact,
        idTipo_Documento: req.body.idTipo_Documento,
        idProveedor: req.body.idProveedor,
        idCaja: req.body.idCaja,
        idorden_compra: req.body.idorden_compra,
        Detalle: req.body.Detalle,
        CuentaPagar: req.body.CuentaPagar

    });

    // Save Compras in the database
    Compras.create(compras, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Compras"
            });
        else res.send(data);
    });
};

// Retrieve all Compras from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idCompras;

    Compras.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Compras"
            });
        else res.send(data);
    });
};

// Find a single Compras with a id
exports.findOne = (req, res) => {
    Compras.findById(req.params.id, (err, data) => {
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


// Update a Compras identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Compras.update(
        req.params.id,
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

// Delete a Compras with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de compras primero
    Compras.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found compras with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete compras with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `compras was deleted successfully!` });
        }
    });
};