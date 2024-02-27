const Compras = require("../models/compras_lote.model.js");

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
        idcompras_lote: req.body.idcompras_lote,
        fecha_doc: req.body.fecha_doc,
        timbrado: req.body.timbrado,
        numero_factura: req.body.numero_factura,
        idTipo_Documento: req.body.idTipo_Documento,
        idProveedor: req.body.idProveedor,
        idorde_compra_lote: req.body.idorde_compra_lote,
        idCaja: req.body.idCaja,
        Detalle: req.body.Detalle

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
    const id = req.query?.idcompras_lote;

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
                        message: `Not found compras_lote with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating compras_lote with id " + req.params.id
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
                    message: `Not found compras_lote with id ${req.params.id}.`
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