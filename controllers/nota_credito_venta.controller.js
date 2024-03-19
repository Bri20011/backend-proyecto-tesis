const Nota_Credito_Venta = require("../models/nota_credito_venta.model.js");

// Create and Save a new Nota_Credito_Venta
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Nota_Credito_Venta
    const nota_credito_venta = new Nota_Credito_Venta({
        idNota_Credito_Venta: req.body.idNota_Credito_Venta,
        Fecha_doc: req.body.Fecha_doc,
        idCliente: req.body.idCliente,
        Numero_doc: req.body.Numero_doc,
        idTimbrado: req.body.idTimbrado,
        idVenta: req.body.idVenta,
        idTipo_Documento: req.body.idTipo_Documento,
        idCaja: req.body.idCaja,
        fecha_vto: req.body.fecha_vto,
        Detalle: req.body.Detalle

    });

    // Save Nota_Credito_Venta in the database
    Nota_Credito_Venta.create(nota_credito_venta, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Nota_Credito_Venta"
            });
        else res.send(data);
    });
};

// Retrieve all Nota_Credito_Venta from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idNota_Credito_Venta;

    Nota_Credito_Venta.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Nota_Credito_Venta"
            });
        else res.send(data);
    });
};

// Find a single Nota_Credito_Venta with a id
exports.findOne = (req, res) => {
    Nota_Credito_Venta.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro nota_credito_venta con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener nota_credito_venta con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Nota_Credito_Venta identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Nota_Credito_Venta.update(
        req.params.id,
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found nota_credito_venta with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating nota_credito_venta with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Nota_Credito_Venta with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de Nota_Credito_Venta primero
    Nota_Credito_Venta.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found nota_credito_venta with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete nota_credito_venta with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `nota_credito_venta was deleted successfully!` });
        }
    });
};