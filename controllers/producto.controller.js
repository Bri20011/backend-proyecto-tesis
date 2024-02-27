const Producto = require("../models/producto.model.js");

// Create and Save a new Producto
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Producto
    const producto = new Producto({
        idProducto: req.body.idProducto,
        Descripcion: req.body.Descripcion,
        Precio: req.body.Precio,
        PrecioCompra: req.body.PrecioCompra,
        idmarca: req.body.idmarca,
        idcategoria: req.body.idcategoria,
        idIva: req.body.idIva,
        idtipo_producto: req.body.idtipo_producto
    });

    // Save Producto in the database
    Producto.create(producto, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al guardar producto"
            });
        else res.send(data);
    });
};

// Retrieve all Producto from the database (with condition).
exports.findAll = (req, res) => {
    const id = req.query?.idProducto;

    Producto.getAll(id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener producto"
            });
        else res.send(data);
    });
};

exports.findByTipo = (req, res) => {
    const idProducto  = req.params?.idProducto;

    Producto.getAllbyTipo(idProducto, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener producto"
            });
        else res.send(data);
    });
};


// Find a single Producto with a id
exports.findOne = (req, res) => {
    Producto.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontro producto con id = ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al obtener producto con id = " + req.params.id
                });
            }
        } else res.send(data);
    });
};


// Update a Producto identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Producto.updateById(
        req.params.id,
        new Producto(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Producto with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Producto with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Producto with the specified id in the request
exports.delete = (req, res) => {
    Producto.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Producto with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Producto with id " + req.params.id
                });
            }
        } else res.send({ message: `Producto was deleted successfully!` });
    });
};
