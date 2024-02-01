const Nota_Remision_Compra = require("../models/nota_remision_compra.model.js");

// Create and Save a new Nota_Remision_Compra
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Nota_Remision_Compra
    const nota_remision_compra = new Nota_Remision_Compra({
        idNota_Remision: req.body.idNota_Remision,
        Fecha_doc: req.body.Fecha_doc,
        Timbrado: req.body.Timbrado,
        Numero_doc: req.body.Numero_doc,
        idProveedor: req.body.idProveedor,
        Detalle: req.body.Detalle

    });

    // Save Nota_Remision_Compra in the database
    Nota_Remision_Compra.create(nota_remision_compra, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Nota_Remision_Compra"
            });
        else res.send(data);
    });
};

// Retrieve all Nota_Remision_Compra from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idNota_Remision;

    Nota_Remision_Compra.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Nota_Remision_Compra"
            });
        else res.send(data);
    });
};

// Find a single Nota_Remision_Compra with a id
exports.findOne = (req, res) => {
    Nota_Remision_Compra.findById(req.params.id, (err, data) => {
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


// Update a Nota_Remision_Compra identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Nota_Remision_Compra.updateById(
        req.params.id,
        new Nota_Remision_Compra(req.body),
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

// Delete a Nota_Remision_Compra with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de Nota_Remision_Compra primero
    Nota_Remision_Compra.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found nota_remision_compra with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete nota_remision_compra with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `nota_remision_compra was deleted successfully!` });
        }
    });
};