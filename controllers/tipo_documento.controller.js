const Tipo_Documento = require("../models/tipo_documento.model.js");

// Create and Save a new Tipo_Documento
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Tipo_Documento
    const tipo_documento = new Tipo_Documento({
        idTipo_Documento: req.body.idTipo_Documento,
        Descripcion: req.body.Descripcion
    });

    // Save Tipo_Documento in the database
    Tipo_Documento.create(tipo_documento, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar tipo_documento"
            });
        else res.send(data);
    });
};

// Retrieve all Tipo_Documento from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idTipo_Documento;

    Tipo_Documento.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener tipo_documento"
            });
        else res.send(data);
    });
};

// Find a single Tipo_Documento with a id
exports.findOne = (req, res) => {
    Tipo_Documento.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro tipo_documento con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener tipo_documento con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Tipo_Documento identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Tipo_Documento.updateById(
        req.params.id,
        new Tipo_Documento(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Tipo_Documento with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Tipo_Documento with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Tipo_Documento with the specified id in the request
exports.delete = (req, res) => {
    Tipo_Documento.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Tipo_Documento with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Tipo_Documento with id " + req.params.id
                });
            }
        } else res.send({ message: `Tipo_Documento was deleted successfully!` });
    });
};
