const Iva = require("../models/iva.model.js");

// Create and Save a new Iva
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Iva
    const iva = new Iva({
        idIva: req.body.idIva,
        Descripcion: req.body.Descripcion,
        Porcentaje: req.body.Porcentaje
    });

    // Save Iva in the database
    Iva.create(iva, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar iva"
            });
        else res.send(data);
    });
};

// Retrieve all Iva from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idIva;

    Iva.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener iva"
            });
        else res.send(data);
    });
};

// Find a single Iva with a id
exports.findOne = (req, res) => {
    Iva.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro iva con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener iva con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Iva identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Iva.updateById(
        req.params.id,
        new Iva(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Iva with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Iva with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Iva with the specified id in the request
exports.delete = (req, res) => {
    Iva.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Iva with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Iva with id " + req.params.id
                });
            }
        } else res.send({ message: `Iva was deleted successfully!` });
    });
};
