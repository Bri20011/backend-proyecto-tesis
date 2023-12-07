const sql = require("../db.js");


// constructord
const Pedido_Urbanizacion = function (pedido_urbanizacion) {
    this.idPedido_Urbanizacion = pedido_urbanizacion.idPedido_Urbanizacion;
    this.Descripcion = pedido_urbanizacion.Descripcion;
    this.Fecha_pedi = pedido_urbanizacion.Fecha_pedi;
    this.Detalle = pedido_urbanizacion.Detalle;
};

Pedido_Urbanizacion.create = (newPedidoUrb, result) => {
    sql.query("SELECT idPedido_Urbanizacion as id FROM pedido_urbanizacion ORDER BY idPedido_Urbanizacion DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO pedido_urbanizacion (idPedido_Urbanizacion, Descripcion, Fecha_pedi) VALUES (?, ?, ?)",
            [newId, newPedidoUrb.Descripcion, newPedidoUrb.Fecha_pedi], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                const detalleFormateado = []
                newPedidoUrb.Detalle.forEach(detalle => {
                    detalleFormateado.push(
                        [newId, detalle.producto, detalle.cantidad]
                    )
                })

                sql.query(`INSERT INTO detalle_pedido_urbanizacion (idPedido_Urbanizacion, idProducto, Cantidad) VALUES ?`,
                    [detalleFormateado], (e) => {
                        if (e) {
                            console.log("error: ", e);
                            result(e, null);
                            return;
                        }

                        result(null, { ...newPedidoUrb });
                    })
            });
    })
};

Pedido_Urbanizacion.findById = (id, result) => {
    sql.query(`SELECT * FROM pedido_urbanizacion WHERE idPedido_Urbanizacion = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found pedido_urbanizacion: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Pedido_Urbanizacion with the id
        result({ kind: "not_found" }, null);
    });
};

Pedido_Urbanizacion.getAll = (id, result) => {
    let query = "SELECT * FROM pedido_urbanizacion";

    let queryDetalle = `SELECT idPedido_Urbanizacion,
    detalle_pedido_urbanizacion.idProducto,
    producto.Descripcion as nombreProducto,
    detalle_pedido_urbanizacion.Cantidad
FROM detalle_pedido_urbanizacion
JOIN producto ON producto.idProducto = detalle_pedido_urbanizacion.idProducto
Where idPedido_Urbanizacion = ?`;

    if (id) {
        query += ` WHERE idPedido_Urbanizacion = ${id}`;
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
                    [cabecera.idPedido_Urbanizacion],
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

        console.log("pedido_urbanizacion: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Pedido_Urbanizacion.updateById = (id, pedido_urbanizacion, result) => {
    sql.query(
        "UPDATE pedido_urbanizacion SET Descripcion = ?, Fecha_pedi = ?  WHERE idPedido_Urbanizacion = ?",
        [pedido_urbanizacion.Descripcion, pedido_urbanizacion.Fecha_pedi, pedido_urbanizacion.idPedido_Urbanizacion],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }


            if (res.affectedRows == 0) {
                // not found Pedido_Urbanizacion with the id
                result({ kind: "not_found" }, null);
                return;
            }
            //UPDATE DETALLE

            const detalleFormateado = []
            pedido_urbanizacion.Detalle.forEach(detalle => {
                detalleFormateado.push(
                    [pedido_urbanizacion.idPedido_Urbanizacion, detalle.idProducto, detalle.Cantidad]
                )
            })


            sql.query(`DELETE FROM detalle_pedido_urbanizacion WHERE idPedido_Urbanizacion = ?`,
                [pedido_urbanizacion.idPedido_Urbanizacion], (e2) => {
                    if (e2) {
                        console.log("error: ", e2);
                        result(e, null);
                        return;
                    }
                    sql.query(`INSERT INTO detalle_pedido_urbanizacion (idPedido_Urbanizacion,idProducto,Cantidad) VALUES ?`,
                        [detalleFormateado], (e) => {
                            if (e) {
                                console.log("error: ", e);
                                result(e, null);
                                return;
                            }

                            result(null, { ...pedido_urbanizacion });
                        })

                })

        }
    );
};

Pedido_Urbanizacion.remove = (id, result) => {
    console.log("Removing pedido_urbanizacion with ID: ", id);

    // Eliminar detalles de Pedido_Urbanizacion primero
    sql.query("DELETE FROM detalle_pedido_urbanizacion WHERE idPedido_Urbanizacion = ?", id, (err, res) => {
        if (err) {
            console.log("error deleting detalle_pedido_urbanizacion: ", err);
            result(null, err);
            return;
        }

        // Ahora eliminar la compra principal
        sql.query("DELETE FROM pedido_urbanizacion WHERE idPedido_Urbanizacion = ?", id, (e, resp) => {
            if (e) {
                console.log("error deleting pedido_urbanizacion: ", e);
                result(null, e);
                return;
            }

            if (resp.affectedRows == 0) {
                // No se encontró la compra con el ID
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Deleted pedido_urbanizacion with ID: ", id);

            result(null, resp);
        });
    });
};

module.exports = Pedido_Urbanizacion;


