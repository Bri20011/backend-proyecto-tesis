const Ciudad = require("../models/ciudad.model.js");

// Create and Save a new Ciudad
exports.create = (req, res) => {
    // Validate request
    console.log('llega aca')
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Ciudad
    const ciudad = new Ciudad({
        idCiudad: req.body.idCiudad,
        descripcion: req.body.descripcion
    });

    // Save Ciudad in the database
    Ciudad.create(ciudad, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar ciudad"
            });
        else res.send(data);
    });
};

// Retrieve all Ciudads from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idCiudad;

    Ciudad.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener ciudad"
            });
        else res.send(data);
    });
};

// Find a single Ciudad with a id
exports.findOne = (req, res) => {
    Ciudad.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro ciudad con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener ciudad con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Ciudad identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Ciudad.updateById(
        req.params.id,
        new Ciudad(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Ciudad with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Ciudad with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Ciudad with the specified id in the request
exports.delete = (req, res) => {
    Ciudad.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Ciudad with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Ciudad with id " + req.params.id
                });
            }
        } else res.send({ message: `Ciudad was deleted successfully!` });
    });
};
