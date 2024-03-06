const sql = require("../db.js");


// constructord
const Precio = function (precio) {
    this.idListado_precio = precio.idListado_precio;
    this.Nombre_Urbanizacion = precio.Nombre_Urbanizacion;
    this.fecha = precio.fecha;
    this.idUrbanizacion = precio.idUrbanizacion;
    this.Ubicacion = precio.Ubicacion;
    this.idCiudad = precio.idCiudad;
    this.idBarrio = precio.idBarrio;
    this.Costo_total = precio.Costo_total;
    this.idStock_Lote = precio.idStock_Lote;
    this.Detalle = precio.Detalle;
};

Precio.create = (newPrecio, result) => {
    sql.query("SELECT idListado_precio as id FROM listado_precio ORDER BY idListado_precio DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO listado_precio (idListado_precio, Nombre_Urbanizacion, fecha,Ubicacion, idCiudad, idBarrio, Costo_total, idUrbanizacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [newId, newPrecio.Nombre_Urbanizacion ||'Tes', newPrecio.fecha, newPrecio.Ubicacion, newPrecio.idCiudad, newPrecio.idBarrio, newPrecio.Costo_total, newPrecio.idUrbanizacion], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                const detalleFormateado = []
                newPrecio.Detalle.forEach(detalle_listado_precio => {
                    detalleFormateado.push(
                        [newId, detalle_listado_precio.idProducto, detalle_listado_precio.id_detalle, detalle_listado_precio.idManzana, detalle_listado_precio.Numero_lote, detalle_listado_precio.ancho_frente, detalle_listado_precio.ancho_atras, detalle_listado_precio.long_izquierdo, detalle_listado_precio.long_derecho, detalle_listado_precio.precioContado, detalle_listado_precio.precioCredito, detalle_listado_precio.montoCredito]
                    )
                })

                sql.query(`INSERT INTO detalle_listado_precio (idListado_precio, idProducto, id_detalle, idManzana, Numero_lote, ancho_frente, ancho_atras, long_izquierdo, long_derecho, precioContado, precioCredito, montoCredito) VALUES ?`,
                    [detalleFormateado], (e) => {
                        if (e) {
                            console.log("error: ", e);
                            result(e, null);
                            return;
                        }


                        result(null, { ...newPrecio });
                    })
            });
    })
};

Precio.findById = (id, result) => {

   const queryCabecera = `SELECT * FROM listado_precio WHERE idListado_precio = ${id}`;

    const queryDetalle = `SELECT idListado_precio,
    detalle_listado_precio.idProducto,
    detalle_listado_precio.id_detalle,
    detalle_listado_precio.idManzana,
	manzana.Descripcion as nombreManzana,
    detalle_listado_precio.Numero_lote,
    detalle_listado_precio.ancho_frente,
    detalle_listado_precio.ancho_atras,
    detalle_listado_precio.long_izquierdo,
    detalle_listado_precio.long_derecho,
    detalle_listado_precio.precioContado,
    detalle_listado_precio.precioCredito,
    detalle_listado_precio.montoCredito
FROM detalle_listado_precio
JOIN producto ON producto.idProducto = detalle_listado_precio.idProducto
JOIN manzana ON manzana.idManzana = detalle_listado_precio.idManzana
WHERE idListado_precio = ?`;

    // Realiza ambas consultas en paralelo
    sql.query(queryCabecera, (errCabecera, resCabecera) => {
        if (errCabecera) {
            console.log("error: ", errCabecera);
            result(errCabecera, null);
            return;
        }

        // Si la cabecera se encuentra, realiza la consulta del detalle
        if (resCabecera.length) {
            sql.query(queryDetalle, [id], (errDetalle, resDetalle) => {
                if (errDetalle) {
                    console.log("error: ", errDetalle);
                    result(errDetalle, null);
                    return;
                }

                // Combina la cabecera y el detalle en un solo objeto
                const notac = {
                    ...resCabecera[0],
                    detalle: resDetalle,
                };

                console.log("found listado_precio: ", notac);
                result(null, notac);
            });
        } else {
            // No se encontró la compras con el id proporcionado
            result({ kind: "not_found" }, null);
        }
    });
};
Precio.getAll = (id, result) => {
    let query = `SELECT listado_precio.idListado_precio,
    listado_precio.Nombre_Urbanizacion,
    listado_precio.fecha,
    listado_precio.Ubicacion,
    listado_precio.idCiudad,
    ciudad.Descripcion as nombreciudad,
    listado_precio.idBarrio,
    barrio.Descripcion as nombrebarrio,
    listado_precio.Costo_total,
    listado_precio.idUrbanizacion
 FROM listado_precio
 JOIN ciudad ON ciudad.idCiudad = listado_precio.idCiudad
 JOIN barrio ON barrio.idBarrio = listado_precio.idBarrio
 WHERE listado_precio.estado_listadoPrecio = false`;

    let queryDetalle = `SELECT idListado_precio,
    detalle_listado_precio.idProducto,
    producto.Descripcion as nombreProducto,
    detalle_listado_precio.id_detalle,
    detalle_listado_precio.idManzana,
    detalle_listado_precio.Numero_lote,
    detalle_listado_precio.ancho_frente,
    detalle_listado_precio.ancho_atras,
    detalle_listado_precio.long_izquierdo,
    detalle_listado_precio.long_derecho,
    detalle_listado_precio.precioContado,
    detalle_listado_precio.precioCredito,
    detalle_listado_precio.montoCredito
FROM detalle_listado_precio
JOIN producto ON producto.idProducto = detalle_listado_precio.idProducto
WHERE idListado_precio = ?`;

    if (id) {
        query += ` WHERE idListado_precio = ${id}`;
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
                    [cabecera.idListado_precio],
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

        console.log("listado_precio: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Precio.updateById = (id, precio, result) => {
    sql.query(
        "UPDATE listado_precio SET  Nombre_Urbanizacion = ?, fecha = ?, Ubicacion = ?, idCiudad = ?, idBarrio = ?, Costo_total = ?, idUrbanizacion = ? WHERE idListado_precio = ?",
        [precio.Nombre_Urbanizacion||'Tes', precio.fecha||'2021-02-15', precio.Ubicacion, precio.idCiudad, precio.idBarrio, precio.Costo_total, precio.idUrbanizacion, precio.idListado_precio],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }


            if (res.affectedRows == 0) {
                // not found Precio with the id
                result({ kind: "not_found" }, null);
                return;
            }
            //UPDATE DETALLE

            const detalleFormateado = []
            precio.Detalle.forEach(detalle => {
                detalleFormateado.push(
                    [detalle.idListado_precio, detalle.idProducto, detalle.id_detalle, detalle.idManzana, detalle.Numero_lote, detalle.ancho_frente, detalle.ancho_atras, detalle.long_izquierdo, detalle.long_derecho, detalle.precioContado, detalle.precioCredito, detalle.montoCredito]
                )
            })
         

            sql.query(`DELETE FROM detalle_listado_precio WHERE idListado_precio = ?`,
            [precio.idListado_precio], (e2) => {
                if (e2) {
                    console.log("error: ", e2);
                    result(e, null);
                    return;
                }
                sql.query(`INSERT INTO detalle_listado_precio (idListado_precio,idProducto,id_detalle,idManzana,Numero_lote,ancho_frente,ancho_atras,long_izquierdo,long_derecho,precioContado,precioCredito,montoCredito) VALUES ?`,
                    [detalleFormateado], (e) => {
                        if (e) {
                            console.log("error: ", e);
                            result(e, null);
                            return;
                        }

                        result(null, { ...precio });
                    })

            })

    }
);
};
module.exports = Precio;


