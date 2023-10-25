const sql = require("../db.js");


// constructor
const Pedido = function (pedido) {
    this.idPedido = pedido.idPedido;
    this.descripcion = pedido.Descripcion;
    this.fecha_pedi = pedido.Fecha_pedi;
    this.Cantidad = pedido.Cantidad;
    this.idProducto = pedido.idProducto;
    this.idmarca = pedido.idmarca;
};

Pedido.create = (newPedido, result) => {
    sql.query("SELECT idPedido as id FROM pedido ORDER BY idPedido DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO pedido (idPedido, descripcion, fecha_pedi, Cantidad, idProducto, idmarca)  VALUES (?, ?, ?, ?, ?, ?)", [newId, newPedido.descripcion, newPedido.fecha_pedi, newPedido.Cantidad, newPedido.idProducto, newPedido.idmarca], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newPedido });
        });
    })
};


Pedido.findById = (id, result) => {
    sql.query(`SELECT * FROM pedido WHERE idPedido = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found pedido: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Pedido with the id
        result({ kind: "not_found" }, null);
    });
};

Pedido.getAll = (id, result) => {
    let query = `SELECT idPedido,
    pedido.Descripcion,
    Fecha_pedi,
    Cantidad,
    pedido.idProducto,
    pedido.idmarca,
    producto.Descripcion as nombreproducto,
    marca.Descripcion as nombremarca
FROM pedido
JOIN producto ON producto.idProducto = pedido.idProducto
JOIN marca ON marca.idmarca = pedido.idmarca;`;

    if (id) {
        query += ` WHERE idPedido = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("pedido: ", res);
        result(null, res);
    });
};


Pedido.updateById = (id, pedido, result) => {   //agregar en esta linea si hay error, numer_establec
    sql.query(
        "UPDATE pedido SET descripcion = ?, fecha_pedi = ?, Cantidad = ?, idProducto = ?, idmarca = ? WHERE idPedido = ?",
        [pedido.descripcion, pedido.fecha_pedi, pedido.Cantidad, pedido.idProducto, pedido.idmarca, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Pedido with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated pedido: ", { ...pedido });
            result(null, { ...pedido });
        }
    );
};

Pedido.remove = (id, result) => {
    sql.query("DELETE FROM pedido WHERE idPedido = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Pedido with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted pedido with id: ", id);
        result(null, res);
    });
};


module.exports = Pedido;