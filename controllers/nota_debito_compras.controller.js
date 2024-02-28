const Nota_Debito_Compra = require("../models/nota_debito_compras.model.js");

// Create and Save a new Nota_Debito_Compra
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Nota_Debito_Compra
    const nota_debito_compras = new Nota_Debito_Compra({
        idNota_Debito_Compra: req.body.idNota_Debito_Compra,
        Fecha_doc: req.body.Fecha_doc,
        Timbrado: req.body.Timbrado,
        Numero_doc: req.body.Numero_doc,
        idProveedor: req.body.idProveedor,
        idCaja: req.body.idCaja,
        fechaVto: req.body.fechaVto,
        idCompras: req.body.idCompras,
        Detalle: req.body.Detalle

    });

    // Save Nota_Debito_Compra in the database
    Nota_Debito_Compra.create(nota_debito_compras, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Nota_Debito_Compra"
            });
        else res.send(data);
    });
};

// Retrieve all Nota_Debito_Compra from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idNota_Debito_Compra;

    Nota_Debito_Compra.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Nota_Debito_Compra"
            });
        else res.send(data);
    });
};

// Find a single Nota_Debito_Compra with a id
exports.findOne = (req, res) => {
    Nota_Debito_Compra.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro nota_debito_compra con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener nota_debito_compra con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Nota_Debito_Compra identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Nota_Debito_Compra.update(
        req.params.id,
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found nota_debito_compra with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating nota_debito_compra with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Nota_Debito_Compra with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de Nota_Debito_Compra primero
    Nota_Debito_Compra.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found nota_debito_compra with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete nota_debito_compra with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `nota_debito_compra was deleted successfully!` });
        }
    });
};