const Stock_Lote = require("../models/stock_lote.model.js");

// Create and Save a new Stock_lote
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Stock_lote
    const stock_lote = new Stock_Lote({
        idStock_Lote: req.body.idStock_Lote,
        idProducto: req.body.idProducto,
        Cantidad: req.body.Cantidad,
       
    });

    // Save Stock_lote in the database
    Stock_Lote.create(stock_lote, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar stock_lote"
            });
        else res.send(data);
    });
};

// Retrieve all Stock_Lote from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idStock_Lote;

    Stock_Lote.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener stock_lote"
            });
        else res.send(data);
    });
};

exports.findByTipo = (req, res) => {
    const idStock_Lote  = req.params?.idStock_Lote;

    Stock_Lote.getAllbyTipo(idStock_Lote, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener producto"
            });
        else res.send(data);
    });
};


// Find a single Stock_Lote with a id
exports.findOne = (req, res) => {
    Stock_Lote.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro stock_lote con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener stock_lote con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Stock_Lote identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Stock_Lote.updateById(
        req.params.id,
        new Stock_Lote(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Stock_Lote with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Stock_Lote with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Stock_Lote with the specified id in the request
exports.delete = (req, res) => {
    Stock_Lote.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Stock_Lote with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Stock_Lote with id " + req.params.id
                });
            }
        } else res.send({ message: `Stock_Lote was deleted successfully!` });
    });
};
