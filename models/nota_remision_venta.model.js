const sql = require("../db.js");


// constructord
const Nota_Remision_Venta = function (nota_remision_venta) {
    this.idnota_remision_venta = nota_remision_venta.idnota_remision_venta;
    this.Fecha_doc = nota_remision_venta.Fecha_doc;
    this.idTimbrado = nota_remision_venta.idTimbrado;
    this.Numero_doc = nota_remision_venta.Numero_doc;
    this.idCliente = nota_remision_venta.idCliente;
    this.Detalle = nota_remision_venta.Detalle;
};

Nota_Remision_Venta.create = (newnota_remision_venta, result) => {
    sql.query("SELECT idnota_remision_venta as id FROM nota_remision_venta ORDER BY idnota_remision_venta DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO nota_remision_venta (idnota_remision_venta, Fecha_doc, idTimbrado, Numero_doc, idCliente) VALUES (?, ?, ?, ?, ?)",
            [newId, newnota_remision_venta.Fecha_doc, newnota_remision_venta.idTimbrado, newnota_remision_venta.Numero_doc, newnota_remision_venta.idCliente], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                const detalleFormateado = []
                newnota_remision_venta.Detalle.forEach(detalle => {
                    detalleFormateado.push(
                        [newId, detalle.producto, detalle.cantidad, detalle.precio]
                    )
                })

                sql.query(`INSERT INTO detalle_remision_venta (idnota_remision_venta, idProducto, Cantidad, Precio)
                VALUES ?`,
                    [detalleFormateado], (e) => {
                        if (e) {
                            console.log("error: ", e);
                            result(e, null);
                            return;
                        }

                        result(null, { ...newnota_remision_venta });
                    })
            });
    })
};

Nota_Remision_Venta.findById = (id, result) => {
    sql.query(`SELECT * FROM nota_remision_venta WHERE idnota_remision_venta = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found nota_remision_venta: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found nota_remision_venta with the id
        result({ kind: "not_found" }, null);
    });
};

Nota_Remision_Venta.getAll = (id, result) => {
    let query =  `SELECT idnota_remision_venta,
    nota_remision_venta.Fecha_doc,
    nota_remision_venta.idTimbrado,
    timbrado.NumerTimbrado as numeroTimbrado,
    nota_remision_venta.Numero_doc,
    nota_remision_venta.idCliente,
    cliente.Razon_social as nombreCliente,
    nota_remision_venta.estado_nr
FROM nota_remision_venta
JOIN timbrado ON timbrado.idTimbrado = nota_remision_venta.idTimbrado
JOIN cliente ON cliente.idCliente = nota_remision_venta.idCliente `

    let queryDetalle = `SELECT idnota_remision_venta,
    detalle_remision_venta.idProducto,
	producto.Descripcion as nomnbreProducto,
    detalle_remision_venta.Cantidad,
    detalle_remision_venta.Precio
FROM detalle_remision_venta
JOIN producto ON producto.idProducto = detalle_remision_venta.idProducto
WHERE idnota_remision_venta =?`;

    if (id) {
        query += ` WHERE idnota_remision_venta = ${id}`;
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
                    [cabecera.idnota_remision_venta],
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

        console.log("nota_remision: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Nota_Remision_Venta.updateById = (id, nota_remision_venta, result) => {
    sql.query(
        "UPDATE nota_remision_venta SET Fecha_doc = ?, idTimbrado = ? , Numero_doc = ? , idCliente = ?  WHERE idnota_remision_venta = ?",
        [nota_remision_venta.Fecha_doc, nota_remision_venta.idTimbrado, nota_remision_venta.Numero_doc, nota_remision_venta.idCliente, nota_remision_venta.idnota_remision_venta],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }


            if (res.affectedRows == 0) {
                // not found Nota_Remision_Venta with the id
                result({ kind: "not_found" }, null);
                return;
            }
            //UPDATE DETALLE

            const detalleFormateado = []
            nota_remision_venta.Detalle.forEach(detalle => {
                detalleFormateado.push(
                    [nota_remision_venta.idnota_remision_venta, detalle.idProducto, detalle.Cantidad, detalle.Precio]
                )
            })


            sql.query(`DELETE FROM detalle_remision_venta WHERE idnota_remision_venta = ?`,
                [nota_remision_venta.idnota_remision_venta], (e2) => {
                    if (e2) {
                        console.log("error: ", e2);
                        result(e, null);
                        return;
                    }
                    sql.query(`INSERT INTO detalle_remision_venta (idnota_remision_venta,idProducto,Cantidad,Precio) VALUES ?`,
                        [detalleFormateado], (e) => {
                            if (e) {
                                console.log("error: ", e);
                                result(e, null);
                                return;
                            }

                            result(null, { ...nota_remision_venta });
                        })

                })

        }
    );
};

Nota_Remision_Venta.remove = (id, result) => {
    console.log("Removing nota_remision_venta with ID: ", id);

    // Eliminar detalles de nota_remision_venta primero
    sql.query("DELETE FROM detalle_remision_venta WHERE idnota_remision_venta = ?", id, (err, res) => {
        if (err) {
            console.log("error deleting detalle_remision_venta: ", err);
            result(null, err);
            return;
        }

        // Ahora eliminar la compra principal
        sql.query("DELETE FROM nota_remision_venta WHERE idnota_remision_venta = ?", id, (e, resp) => {
            if (e) {
                console.log("error deleting nota_remision_venta: ", e);
                result(null, e);
                return;
            }

            if (resp.affectedRows == 0) {
                // No se encontró la compra con el ID
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Deleted nota_remision_venta with ID: ", id);

            result(null, resp);
        });
    });
};

module.exports = Nota_Remision_Venta;


