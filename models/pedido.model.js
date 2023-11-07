const sql = require("../db.js");


// constructord
const Pedido = function (pedido) {
    this.idPedido = pedido.idPedido;
    this.Descripcion = pedido.Descripcion;
    this.Fecha_pedi = pedido.Fecha_pedi;
    this.Detalle = pedido.Detalle;
};

Pedido.create = (newPedido, result) => {
    sql.query("SELECT idPedido as id FROM pedido ORDER BY idPedido DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO pedido (idPedido, Descripcion, Fecha_pedi) VALUES (?, ?, ?)", 
        [newId, newPedido.Descripcion, newPedido.Fecha_pedi], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            
            const detalleFormateado = []
            newPedido.Detalle.forEach(detalle => {
                detalleFormateado.push(
                  [newId, detalle.producto, detalle.cantidad]  
                )
            })

            sql.query(`INSERT INTO detalle_pedido (idPedido,idProducto,Cantidad) VALUES ?`, 
            [detalleFormateado], (e) => {
                if (e) {
                    console.log("error: ", e);
                    result(e, null);
                    return;
                }

                result(null, { ...newPedido });
            })
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

    let queryDetalle = `SELECT idPedido,
    detalle_pedido.idProducto,
    producto.Descripcion as nomnbreProducto,
    detalle_pedido.Cantidad
FROM detalle_pedido
JOIN producto ON producto.idProducto = detalle_pedido.idProducto
Where idPedido = ?`;

    if (id) {
        query += ` WHERE idPedido = ${id}`;
    }

    sql.query(query, async (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        
        const cabeceraConDetalle = []

        for await (cabecera of res) {
            const promesa = new Promise((resolver, rechazar) => {
                sql.query(queryDetalle,
                    [cabecera.idPedido],
                    async (err2, res2) => {
                        if (err2) {
                            console.log("error: ", err);
                            return;
                        }
                        resolver(res2);
                    })
            })

           const detalle = await promesa

           cabeceraConDetalle.push({
            ...cabecera,
            detalle: detalle
           })
        }

        console.log("pedido: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Pedido.updateById = (id, pedido, result) => {
    sql.query(
        "UPDATE pedido SET Descripcion = ?, Fecha_pedi = ?  WHERE idPedido = ?",
        [pedido.Descripcion, pedido.Fecha_pedi,  idPedido],
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
    console.log("Removing pedido with ID: ", id);

    // Eliminar detalles de pedido primero
    sql.query("DELETE FROM detalle_pedido WHERE idPedido = ?", id, (err, res) => {
        if (err) {
            console.log("error deleting detalle_pedido: ", err);
            result(null, err);
            return;
        }

        // Ahora eliminar la compra principal
        sql.query("DELETE FROM pedido WHERE idPedido = ?", id, (e, resp) => {
            if (e) {
                console.log("error deleting pedido: ", e);
                result(null, e);
                return;
            }

            if (resp.affectedRows == 0) {
                // No se encontró la compra con el ID
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Deleted pedido with ID: ", id);

            result(null, resp);
        });
    });
};

module.exports = Pedido;


