const Stock = require("../models/stock.model.js");

// Create and Save a new Stock
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Stock
    const stock = new Stock({
        idStock: req.body.idStock,
        idProducto: req.body.idProducto,
        Cantidad: req.body.Cantidad,
       
    });

    // Save Stock in the database
    Stock.create(stock, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar stock"
            });
        else res.send(data);
    });
};

// Retrieve all Stock from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idStock;

    Stock.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener stock"
            });
        else res.send(data);
    });
};

exports.findByTipo = (req, res) => {
    const idStock  = req.params?.idStock;

    Stock.getAllbyTipo(idStock, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener producto"
            });
        else res.send(data);
    });
};


// Find a single Stock with a id
exports.findOne = (req, res) => {
    Stock.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro stock con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener stock con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Stock identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Stock.updateById(
        req.params.id,
        new Stock(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Stock with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Stock with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Stock with the specified id in the request
exports.delete = (req, res) => {
    Stock.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Stock with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Stock with id " + req.params.id
                });
            }
        } else res.send({ message: `Stock was deleted successfully!` });
    });
};
