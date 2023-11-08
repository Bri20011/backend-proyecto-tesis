const sql = require("../db.js");


// constructord
const Orden_Compra = function (orden_compra) {
    this.idorden_compra = orden_compra.idorden_compra;
    this.Descripcion = orden_compra.Descripcion;
    this.Fecha_pedi = orden_compra.Fecha_pedi;
    this.idProveedor = orden_compra.idProveedor
    this.Detalle = orden_compra.Detalle;
};

Orden_Compra.create = (newOrdenC, result) => {
    sql.query("SELECT idorden_compra as id FROM orden_compra ORDER BY idorden_compra DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO orden_compra (idorden_compra, idPedido, Descripcion, Fecha_pedi, idProveedor) VALUES (?, ?, ?, ?,?)", 
        [newId, newOrdenC.idorden_compra, newOrdenC.Descripcion, newOrdenC.Fecha_pedi, newOrdenC.idProveedor], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            
            const detalleFormateado = []
            newOrdenC.Detalle.forEach(detalle => {
                detalleFormateado.push(
                  [newId, detalle.idProducto, detalle.Cantidad]  
                )
            })

            sql.query(`INSERT INTO detalle_orden_compra (idorden_compra,idProducto,Cantida) VALUES ?`, 
            [detalleFormateado], (e) => {
                if (e) {
                    console.log("error: ", e);
                    result(e, null);
                    return;
                }

                result(null, { ...newOrdenC });
            })
        });
    })
};

Orden_Compra.findById = (id, result) => {
    sql.query(`SELECT * FROM orden_compra WHERE idorden_compra = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found orden_compra: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Orden_Compra with the id
        result({ kind: "not_found" }, null);
    });
};

Orden_Compra.getAll = (id, result) => {
    let query = "SELECT * FROM orden_compra";

    let queryDetalle = `SELECT idorden_compra,
    detalle_orden_compra.idProducto,
	producto.Descripcion as nomnbreProducto,
    detalle_orden_compra.Cantida
FROM detalle_orden_compra
JOIN producto ON producto.idProducto = detalle_orden_compra.idProducto
WHERE idorden_compra = ?`;

    if (id) {
        query += ` WHERE idorden_compra = ${id}`;
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
                    [cabecera.idorden_compra],
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

        console.log("orden_compra: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Orden_Compra.updateById = (id, orden_compra, result) => {
    sql.query(
        "UPDATE orden_compra SET Descripcion = ?, Fecha_pedi = ?, idProveedor = ?   WHERE idorden_compra = ?",
        [orden_compra.Descripcion, orden_compra.Fecha_pedi, orden_compra.idProveedor,  idorden_compra],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Orden_Compra with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated orden_compra: ", { ...orden_compra });
            result(null, { ...orden_compra });
        }
    );
};

Orden_Compra.remove = (id, result) => {
    console.log("Removing orden_compra with ID: ", id);

    // Eliminar detalles de orden_compra primero
    sql.query("DELETE FROM detalle_orden_compra WHERE idorden_compra = ?", id, (err, res) => {
        if (err) {
            console.log("error deleting detalle_orden_compra: ", err);
            result(null, err);
            return;
        }

        // Ahora eliminar la compra principal
        sql.query("DELETE FROM detalle_orden_compra WHERE idorden_compra = ?", id, (e, resp) => {
            if (e) {
                console.log("error deleting orden_compra: ", e);
                result(null, e);
                return;
            }

            if (resp.affectedRows == 0) {
                // No se encontró la compra con el ID
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Deleted orden_compra with ID: ", id);

            result(null, resp);
        });
    });
};

module.exports = Orden_Compra;


