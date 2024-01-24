const Timbrado = require("../models/timbrado.model.js");

// Create and Save a new Timbrado
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Timbrado
    const timbrado = new Timbrado({
        idTimbrado: req.body.idTimbrado,
        Descripcion: req.body.Descripcion,
        NumerTimbrado: req.body.NumerTimbrado,
        fecha_inicio: req.body.fecha_inicio,
        fecha_fin: req.body.fecha_fin,
        idPunto_exp: req.body.idPunto_exp,
        idEstablecimiento: req.body.idEstablecimiento,
        idTipo_Documento: req.body.idTipo_Documento
    });

    // Save Timbrado in the database
    Timbrado.create(timbrado, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar timbrado"
            });
        else res.send(data);
    });
};

// Retrieve all Timbrado from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idTimbrado;

    Timbrado.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener timbrado"
            });
        else res.send(data);
    });
};

// Find a single Timbrado with a id
exports.findOne = (req, res) => {
    Timbrado.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro timbrado con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener timbrado con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Timbrado identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Timbrado.updateById(
        req.params.id,
        new Timbrado(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Timbrado with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Timbrado with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Timbrado with the specified id in the request
exports.delete = (req, res) => {
    Timbrado.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Timbrado with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Timbrado with id " + req.params.id
                });
            }
        } else res.send({ message: `Timbrado was deleted successfully!` });
    });
};
