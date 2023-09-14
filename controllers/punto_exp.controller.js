const Punto_exp = require("../models/punto_exp.model.js");

// Create and Save a new Punto_exp
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Punto_exp
    const punto_exp = new Punto_exp({
        idPunto_exp: req.body.idPunto_exp,
        Descripcion: req.body.Descripcion,
        Numer_punto_exp: req.body.Numer_punto_exp
    });

    // Save Punto_exp in the database
    Punto_exp.create(punto_exp, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar punto_exp"
            });
        else res.send(data);
    });
};

// Retrieve all Punto_exp from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idPunto_exp;

    Punto_exp.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener punto_exp"
            });
        else res.send(data);
    });
};

// Find a single Punto_exp with a id
exports.findOne = (req, res) => {
    Punto_exp.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro punto_exp con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener punto_exp con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Punto_exp identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Punto_exp.updateById(
        req.params.id,
        new Punto_exp(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Punto_exp with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Punto_exp with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Punto_exp with the specified id in the request
exports.delete = (req, res) => {
    Punto_exp.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Punto_exp with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Punto_exp with id " + req.params.id
                });
            }
        } else res.send({ message: `Punto_exp was deleted successfully!` });
    });
};
