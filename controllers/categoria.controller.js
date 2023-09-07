const Categoria = require("../models/categoria.model.js");

// Create and Save a new Categoria
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Categoria
    const categoria = new Categoria({
        idcategoria: req.body.idcategoria,
        Descripcion: req.body.Descripcion
    });

    // Save Categoria in the database
    Categoria.create(categoria, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar Categoria"
            });
        else res.send(data);
    });
};

// Retrieve all Categoria from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idcategoria;

    Categoria.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener Categoria"
            });
        else res.send(data);
    });
};

// Find a single categoria with a id
exports.findOne = (req, res) => {
    Categoria.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro Categoria con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener Categoria con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Categoria identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Categoria.updateById(
        req.params.id,
        new Categoria(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Categoria with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Categoria with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Categoria with the specified id in the request
exports.delete = (req, res) => {
    Categoria.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Categoria with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Categoria with id " + req.params.id
                });
            }
        } else res.send({ message: `Cartegoria was deleted successfully!` });
    });
};
