const sql = require("../db.js");
const Stock_Lote = require("./stock_lote.model.js")


// constructord
const Compras = function (compras) {
    this.idcompras_lote = compras.idcompras_lote;
    this.fecha_doc = compras.fecha_doc;
    this.timbrado = compras.timbrado;
    this.numero_factura = compras.numero_factura;
    this.idTipo_Documento = compras.idTipo_Documento;
    this.idProveedor = compras.idProveedor;
    this.idorde_compra_lote = compras.idorde_compra_lote;
    this.idCaja = compras.idCaja;
    this.Detalle = compras.Detalle;
};

Compras.create = (newCompras, result) => {
    sql.query("SELECT idcompras_lote as id FROM compras_lote ORDER BY idcompras_lote DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO compras_lote (idcompras_lote, fecha_doc, timbrado, numero_factura, idTipo_Documento, idProveedor,idCaja, idorde_compra_lote) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
        [newId, newCompras.fecha_doc, newCompras.timbrado, newCompras.numero_factura, newCompras.idTipo_Documento, newCompras.idProveedor, newCompras.idCaja, newCompras.idorde_compra_lote], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            
            const detalleFormateado = []
            newCompras.Detalle.forEach(detalle => {
                detalleFormateado.push(
                  [newId, detalle.idProducto, detalle.cantidad_lote, detalle.costo_lote, detalle.ciudad, detalle.barrio, detalle.ubicacion, detalle.dimension_total, detalle.Descripcion_lote]  
                )
            })


            sql.query(`INSERT INTO detalle_compras_lote (idcompras_lote, idProducto, cantidad_lote, costo_lote, idCiudad, idBarrio, ubicacion, dimension_total, Descripcion_lote) VALUES ?`, 
            [detalleFormateado], (e) => {
                if (e) {
                    console.log("error: ", e);
                    result(e, null);
                    return;
                }
                detalleFormateado.forEach(elemento => {
                    // Se recorre el array de detalleFormateado y se envia como parametro idproducto, cantidad
                    // que estan en la posicion 1 y 3
                    Stock_Lote.update(elemento[1], elemento[2], true)
                })
                result(null, { ...newCompras });
            })
        });
    })
};

Compras.findById = (numeroFactura, result) => {
    const queryCabecera = `SELECT * FROM compras_lote WHERE numero_factura = ?`;

    const queryDetalle = `SELECT idcompras_lote,
    detalle_compras_lote.idProducto,
	producto.Descripcion as nombreProducto,
    detalle_compras_lote.cantidad_lote,
    detalle_compras_lote.costo_lote,
    detalle_compras_lote.idCiudad,
    ciudad.Descripcion as nombreCiudad,
    detalle_compras_lote.idBarrio,
    Barrio.descripcion as nombreBarrio,
    detalle_compras_lote.ubicacion,
    detalle_compras_lote.dimension_total,
    detalle_compras_lote.Descripcion_lote
FROM detalle_compras_lote
JOIN producto ON producto.idProducto = detalle_compras_lote.idProducto
JOIN barrio ON barrio.idBarrio = detalle_compras_lote.idBarrio
JOIN ciudad ON ciudad.idCiudad = detalle_compras_lote.idCiudad
WHERE idcompras_lote = ?`;

    // Realiza ambas consultas en paralelo
    sql.query(queryCabecera,[numeroFactura], (errCabecera, resCabecera) => {
        if (errCabecera) {
            console.log("error: ", errCabecera);
            result(errCabecera, null);
            return;
        }

        // Si la cabecera se encuentra, realiza la consulta del detalle
        if (resCabecera.length) {
            const idcompras_lote = resCabecera[0].idcompras_lote;

            sql.query(queryDetalle, [idcompras_lote], (errDetalle, resDetalle) => {
                if (errDetalle) {
                    console.log("error: ", errDetalle);
                    result(errDetalle, null);
                    return;
                }

                // Combina la cabecera y el detalle en un solo objeto
                const CompraC = {
                    ...resCabecera[0],
                    detalle: resDetalle,
                };

                console.log("found compras: ", CompraC);
                result(null, CompraC);
            });
        } else {
            // No se encontró la compras con el id proporcionado
            result({ kind: "not_found" }, null);
        }
    });
};

Compras.getAll = (id, result) => {
    let query = "SELECT * FROM compras_lote WHERE compras_lote.estado_compra_lote = false";

    let queryDetalle = 
    `SELECT idcompras_lote,
    detalle_compras_lote.idProducto,
	producto.Descripcion as nombreProducto,
    detalle_compras_lote.cantidad_lote,
    detalle_compras_lote.costo_lote,
    detalle_compras_lote.idCiudad,
    ciudad.Descripcion as nombreCiudad,
    detalle_compras_lote.idBarrio,
    Barrio.descripcion as nombreBarrio,
    detalle_compras_lote.ubicacion,
    detalle_compras_lote.dimension_total,
    detalle_compras_lote.Descripcion_lote
FROM detalle_compras_lote
JOIN producto ON producto.idProducto = detalle_compras_lote.idProducto
JOIN barrio ON barrio.idBarrio = detalle_compras_lote.idBarrio
JOIN ciudad ON ciudad.idCiudad = detalle_compras_lote.idCiudad
WHERE idcompras_lote =  ?`;

    if (id) {
        query += ` WHERE idcompras_lote = ${id}`;
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
                    [cabecera.idcompras_lote],
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

        console.log("compras: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Compras.update = (id, result) => {
    console.log("Updating state of compras_lote with ID: ", id);


    // Actualizar el estado de compras a true
    sql.query("UPDATE compras_lote SET estado_compra_lote = true WHERE idcompras_lote = ?", [id], (err, res) => 
    {
        if (err) {
            console.log("error updating compras: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // No se encontró la compra con el ID
            result({ kind: "not_found" }, null);
            return;
        }

        sql.query("SELECT idcompras_lote, idProducto, cantidad_lote, costo_lote, idCiudad, idBarrio, ubicacion, dimension_total, Descripcion_lote FROM detalle_compras_lote WHERE idcompras_lote = ?;", [id], (err, res_detalle) => {
            if (err) {
                console.log("error al obtener detalle en cambiar estado_compra_lote: ", err);
                result(err, null);
                return;
            }
            res_detalle.forEach(element => {
                Stock_Lote.update(element.idProducto, element.cantidad_lote, false)
            })
        })

        console.log("Updated state of compras with ID: ", id);
        result(null, res);

       
    });
};

module.exports = Compras;


