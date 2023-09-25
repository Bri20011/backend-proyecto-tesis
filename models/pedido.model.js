const sql = require("../db.js");


// constructor
const Pedido = function (pedido) {
    this.idPedido = pedido.idPedido;
    this.descripcion = pedido.Descripcion;
    this.fecha_pedi = pedido.Fecha_pedi;
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

        sql.query("INSERT INTO pedido (idPedido, descripcion, fecha_pedi)  VALUES (?, ?, ?)", [newId, newPedido.descripcion, newPedido.fecha_pedi], (err, res) => {
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
    let query = "SELECT * FROM pedido";

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
        "UPDATE pedido SET descripcion = ?, fecha_pedi = ? WHERE idPedido = ?",
        [pedido.descripcion, pedido.fecha_pedi, id],
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