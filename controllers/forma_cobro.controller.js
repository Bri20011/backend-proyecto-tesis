const FormaCobro = require("../models/forma_cobro.model.js");

// Create and Save a new FormaCobro
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    
    // Create a FormaCobro 
    const formacobro = new FormaCobro({
        idforma_cobro: req.body.idforma_cobro,
        Descripcion: req.body.Descripcion
    });

    // Save FormaCobro in the database
    FormaCobro.create(formacobro, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar formacobro"
            });
        else res.send(data);
    });
};

// Retrieve all FormaCobro from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idforma_cobro;

    FormaCobro.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener formacobro"
            });
        else res.send(data);
    });
};

// Find a single FormaCobro with a id
exports.findOne = (req, res) => {
    FormaCobro.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro formacobro con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener formacobro con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a FormaCobro identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    FormaCobro.updateById(
        req.params.id,
        new FormaCobro(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found FormaCobro with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating FormaCobro with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a FormaCobro with the specified id in the request
exports.delete = (req, res) => {
    FormaCobro.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found FormaCobro with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete FormaCobro with id " + req.params.id
                });
            }
        } else res.send({ message: `FormaCobro was deleted successfully!` });
    });
};
