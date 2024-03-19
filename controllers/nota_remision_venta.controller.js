const Nota_Remision_Venta = require("../models/nota_remision_venta.model.js");

// Create and Save a new Nota_Remision_Venta
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Nota_Remision_Venta
    const nota_remision_venta = new Nota_Remision_Venta({
        idnota_remision_venta: req.body.idnota_remision_venta,
        Fecha_doc: req.body.Fecha_doc,
        idTimbrado: req.body.idTimbrado,
        Numero_doc: req.body.Numero_doc,
        idCliente: req.body.idCliente,
        Detalle: req.body.Detalle

    });

    // Save Nota_Remision_Venta in the database
    Nota_Remision_Venta.create(nota_remision_venta, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Nota_Remision_Venta"
            });
        else res.send(data);
    });
};

// Retrieve all Nota_Remision_Venta from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idnota_remision_venta;

    Nota_Remision_Venta.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Nota_Remision_Venta"
            });
        else res.send(data);
    });
};

// Find a single Nota_Remision_Venta with a id
exports.findOne = (req, res) => {
    Nota_Remision_Venta.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro nota_remision_venta con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener nota_remision_venta con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Nota_Remision_Venta identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Nota_Remision_Venta.updateById(
        req.params.id,
        new Nota_Remision_Venta(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found nota_remision_venta with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating nota_remision_venta with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Nota_Remision_Venta with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de Nota_Remision_Venta primero
    Nota_Remision_Venta.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found nota_remision_venta with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete nota_remision_venta with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `nota_remision_venta was deleted successfully!` });
        }
    });
};