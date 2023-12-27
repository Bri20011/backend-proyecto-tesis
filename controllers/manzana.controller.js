const Manzana = require("../models/manzana.model.js");

// Create and Save a new Manzana
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Manzana
    const manzana = new Manzana({
        idManzana: req.body.idManzana,
        numero_manzana: req.body.numero_manzana,
        Descripcion: req.body.Descripcion,

    });

    // Save Manzana in the database
    Manzana.create(manzana, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar manzana"
            });
        else res.send(data);
    });
};

// Retrieve all Manzana from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idManzana;

    Manzana.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener manzana"
            });
        else res.send(data);
    });
};

// Find a single Manzana with a id
exports.findOne = (req, res) => {
    Manzana.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro manzana con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener manzana con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Manzana identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Manzana.updateById(
        req.params.id,
        new Manzana(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Manzana with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Manzana with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Manzana with the specified id in the request
exports.delete = (req, res) => {
    Manzana.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Manzana with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Manzana with id " + req.params.id
                });
            }
        } else res.send({ message: `Manzana was deleted successfully!` });
    });
};
