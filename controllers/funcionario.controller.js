const Funcionario = require("../models/funcionario.model.js");

// Create and Save a new Funcionario
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Funcionario
    const funcionario = new Funcionario({
        idFuncionario: req.body.idFuncionario,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
        idBarrio: req.body.idBarrio,
        idCiudad: req.body.idCiudad
    });

    // Save Funcionario in the database
    Funcionario.create(funcionario, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar funcionario"
            });
        else res.send(data);
    });
};

// Retrieve all Funcionario from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idFuncionario;

    Funcionario.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener funcionario"
            });
        else res.send(data);
    });
};

// Find a single Funcionario with a id
exports.findOne = (req, res) => {
    Funcionario.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro funcionario con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener funcionario con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Funcionario identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Funcionario.updateById(
        req.params.id,
        new Funcionario(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Funcionario with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Funcionario with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Funcionario with the specified id in the request
exports.delete = (req, res) => {
    Funcionario.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Funcionario with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Funcionario with id " + req.params.id
                });
            }
        } else res.send({ message: `Funcionario was deleted successfully!` });
    });
};
