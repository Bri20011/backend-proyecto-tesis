const Contrato = require("../models/contrato.model.js");

// Create and Save a new Contrato
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Contrato
    const contrato = new Contrato({
        idContrato: req.body.idContrato,
        idListado_precio: req.body.idListado_precio,
        nombre_urbanizacion: req.body.nombre_urbanizacion,
        fecha_contrato: req.body.fecha_contrato,
        idCliente: req.body.idCliente,
        idCiudad: req.body.idCiudad,
        idtipo_venta: req.body.idtipo_venta,
        ubicacion: req.body.ubicacion,
        numero_manzana: req.body.numero_manzana,
        numero_lote: req.body.numero_lote,
        Detalle: req.body.detalle,
    });

    // Save Contrato in the database
    Contrato.create(contrato, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Contrato"
            });
        else res.send(data);
    });
};

// Retrieve all Contrato from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idContrato;

    Contrato.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Contrato"
            });
        else res.send(data);
    });
};

// Find a single Contrato with a id
exports.findOne = (req, res) => {
    Contrato.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro Contrato con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener Contrato con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Contrato identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Contrato.updateById(
        req.params.id,
        new Contrato(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found contrato with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating contrato with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Contrato with the specified id in the request
exports.delete = (req, res) => {
    // Eliminar detalles de Contrato primero
    Contrato.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found contrato with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete contrato with id " + req.params.id
                });
            }
        } else {
            res.send({ message: `contrato was deleted successfully!` });
        }
    });
};