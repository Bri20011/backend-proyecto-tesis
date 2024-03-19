const sql = require("../db.js");


// constructord
const Nota_Credito_Venta = function (nota_credito_venta) {
    this.idNota_Credito_Venta = nota_credito_venta.idNota_Credito_Venta;
    this.Fecha_doc = nota_credito_venta.Fecha_doc;
    this.idCliente = nota_credito_venta.idCliente;
    this.Numero_doc = nota_credito_venta.Numero_doc;
    this.idTimbrado = nota_credito_venta.idTimbrado;
    this.idVenta = nota_credito_venta.idVenta;
    this.idTipo_Documento = nota_credito_venta.idTipo_Documento;
    this.idCaja = nota_credito_venta.idCaja;
    this.fecha_vto = nota_credito_venta.fecha_vto;
    this.Detalle = nota_credito_venta.Detalle;
};

Nota_Credito_Venta.create = (newNCV, result) => {
    sql.query("SELECT idNota_Credito_Venta as id FROM nota_credito_venta ORDER BY idNota_Credito_Venta DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO nota_credito_venta (idNota_Credito_Venta, Fecha_doc, idCliente, Numero_doc, idTimbrado, idVenta, idTipo_Documento, idCaja, fecha_vto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [newId, newNCV.Fecha_doc, newNCV.idCliente, newNCV.Numero_doc, newNCV.idTimbrado, newNCV.idVenta, newNCV.idTipo_Documento, newNCV.idCaja || 100, newNCV.fecha_vto || '2021-01-15'], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            
            const detalleFormateado = []
            newNCV.Detalle.forEach(detalle => {
                detalleFormateado.push(
                  [newId, detalle.idContrato, detalle.Precio, detalle.Cantidad]  
                )
            })

            sql.query(`INSERT INTO detalle_nota_credito_venta (idNota_Credito_Venta, idContrato, Precio, Cantidad) VALUES ?`, 
            [detalleFormateado], (e) => {
                if (e) {
                    console.log("error: ", e);
                    result(e, null);
                    return;
                }
                

                result(null, { ...newNCV });
            })
        });
    })
};

Nota_Credito_Venta.findById = (id, result) => {

   const queryCabecera = `SELECT * FROM nota_credito_compra WHERE idNota_CreditoCompra = ${id}`;

    const queryDetalle = `SELECT idNota_CreditoCompra,
    detalle_nota_credito.idProducto,
    producto.Descripcion as nombreProducto,
    producto.IdIva,
    detalle_nota_credito.Precio,
    detalle_nota_credito.Cantidad
FROM detalle_nota_credito
JOIN producto ON producto.idProducto = detalle_nota_credito.idProducto
WHERE idNota_CreditoCompra`;

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

                console.log("found nota_credito_compra: ", notac);
                result(null, notac);
            });
        } else {
            // No se encontró la compras con el id proporcionado
            result({ kind: "not_found" }, null);
        }
    });
};
Nota_Credito_Venta.getAll = (id, result) => {
    let query = `SELECT idNota_Credito_Venta,
    nota_credito_venta.Fecha_doc,
    nota_credito_venta.idCliente,
    cliente.Razon_social as nombreCliente,
    nota_credito_venta.Numero_doc,
    nota_credito_venta.idTimbrado,
    timbrado.NumerTimbrado as numeroTimbrado,
    nota_credito_venta.idVenta,
    nota_credito_venta.idTipo_Documento,
    tipo_documento.Descripcion as nombreTipoVenta,
    nota_credito_venta.idCaja,
    nota_credito_venta.estado_nr_venta,
    nota_credito_venta.fecha_vto
FROM nota_credito_venta
JOIN tipo_documento ON tipo_documento.idTipo_Documento = nota_credito_venta.idTipo_Documento
JOIN cliente ON cliente.idCliente = nota_credito_venta.idCliente
JOIN timbrado ON timbrado.idTimbrado = nota_credito_venta.idTimbrado
WHERE nota_credito_venta.estado_nr_venta = false `;

    let queryDetalle = 
    `SELECT idContrato,
    detalle_nota_credito_venta.idNota_Credito_Venta,
    detalle_nota_credito_venta.Precio,
    detalle_nota_credito_venta.Cantidad
FROM detalle_nota_credito_venta
WHERE idNota_Credito_Venta = ?`;

    if (id) {
        query += ` WHERE idNota_Credito_Venta = ${id}`;
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
                    [cabecera.idNota_Credito_Venta],
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

        console.log("nota_credito_compra: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Nota_Credito_Venta.update = (id, result) => {
    console.log("Updating state of nota_credito_compra with ID: ", id);


    // Actualizar el estado de nota_credito_compra a true
    sql.query("UPDATE nota_credito_venta SET estado_nr_venta = true WHERE idNota_Credito_Venta = ?", [id], (e2, res) => 
    {
        if (e2) {
            console.log("error updating nota_credito_venta: ", e2);
            result(e2, null);
            return;
        }

        if (res.affectedRows == 0) {
            // No se encontró la compra con el ID
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Updated state of nota_credito_venta with ID: ", id);
        result(null, res);

       
    });
};

module.exports = Nota_Credito_Venta;


