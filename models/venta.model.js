const sql = require("../db.js");
const Stock = require("./stock.model.js")
const dayjs = require('dayjs')


// constructord
const Ventas = function (venta) {
    this.idventa = venta.idventa;
    this.Fecha = venta.Fecha;
    this.Numero_fact = venta.Numero_fact;
    this.idtipo_venta = venta.idtipo_venta;
    this.idCliente = venta.idCliente;
    this.idTimbrado = venta.idTimbrado;
    this.idAperturacaja = venta.idAperturacaja;
    this.idCaja = venta.idCaja;
    this.Detalle = venta.Detalle;
    this.CuentaPagar = venta.CuentaPagar;
};

Ventas.create = (newVenta, result) => {
    sql.query("SELECT idventa as id FROM venta ORDER BY idventa DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO venta (idventa,Fecha,Numero_fact,idCliente,idTimbrado,idAperturacaja,idCaja,idtipo_venta) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [newId, newVenta.Fecha, newVenta.Numero_fact, newVenta.idCliente, newVenta.idTimbrado.id||'1314545', newVenta.idAperturacaja||1, newVenta.idCaja || 100, newVenta.idtipo_venta], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                const detalleFormateado = []
                console.log('New Venta: ', newVenta)
                newVenta.Detalle.forEach(detalle => {
                    detalleFormateado.push(
                        [newId, detalle.idContrato, detalle.monto_total, detalle.cantidad, detalle.exenta, detalle.iva5, detalle.iva10]
                    )
                })


                sql.query(`INSERT INTO detalle_venta_cliente (idventa,idContrato,monto_total,cantidad,exenta,iva5,iva10) VALUES ?`,
                    [detalleFormateado], (e) => {
                        if (e) {
                            console.log("error: ", e);
                            result(e, null);
                            return;
                        }
                        detalleFormateado.forEach(elemento => {
                            // Se recorre el array de detalleFormateado y se envia como parametro idproducto, cantidad
                            // que estan en la posicion 1 y 3
                            Stock.update(elemento[1], elemento[3], true)
                        })
                        result(null, { ...newVenta, idventa: newId });
                    })
               

            });
    })
};


Ventas.getAll = (id, result) => {
    let query = `SELECT venta.*,
    cliente.Razon_social AS Razon_social_Cliente,
    venta.Numero_fact,
    venta.idtipo_venta,
    tipo_venta.Descripcion AS descripcionVenta,
    timbrado.idTimbrado,
    timbrado.NumerTimbrado AS NumeroTimbrado
FROM venta
JOIN cliente ON venta.idCliente = cliente.idCliente
JOIN tipo_venta ON venta.idtipo_venta = tipo_venta.idtipo_venta
JOIN timbrado ON venta.idTimbrado = timbrado.idTimbrado
WHERE venta.estado_venta = false`;

    let queryDetalle =
        `SELECT idventa,
        detalle_venta_cliente.idContrato,
        detalle_venta_cliente.monto_total,
        detalle_venta_cliente.cantidad,
        detalle_venta_cliente.exenta,
        detalle_venta_cliente.iva5,
        detalle_venta_cliente.iva10
    FROM detalle_venta_cliente
    WHERE idventa = ?`;

    if (id) {
        query += ` WHERE idventa = ${id}`;
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
                    [cabecera.idventa],
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

        console.log("venta: ", cabeceraConDetalle);
        result(null, cabeceraConDetalle);
    });
};


Ventas.obtenerNumeroFactura = (id, result) => {
    let query =
        `SELECT COALESCE(MAX(Numero_fact) + 1, 1) AS Siguiente_numero_factura
         FROM venta`

    if (id) {
        query += ` WHERE idTimbrado = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("venta: ", res);
        result(null, res);
    });
};


Ventas.libroventa = (id, result) => {
    let query =
        `SELECT 
        venta.idventa,
        venta.Fecha,
        venta.Numero_fact,
        venta.idTimbrado,
        timbrado.NumerTimbrado as numeroTimbrado,
        venta.idCliente,
        cliente.Razon_social as nombreCliente,
        venta.idtipo_venta,
        tipo_venta.Descripcion as nombretipoventa,
        SUM(detalle_venta_cliente.iva5) as iva5,
        SUM(detalle_venta_cliente.iva10) as iva10,
        SUM(detalle_venta_cliente.exenta) as exenta,
        SUM(detalle_venta_cliente.monto_total) as monto_total
    FROM venta
    JOIN timbrado ON timbrado.idTimbrado = venta.idTimbrado
    JOIN cliente ON cliente.idCliente = venta.idCliente
    JOIN tipo_venta ON tipo_venta.idtipo_venta = venta.idtipo_venta
    LEFT JOIN detalle_venta_cliente ON detalle_venta_cliente.idventa = venta.idventa
    GROUP BY venta.idventa, venta.Fecha, venta.Numero_fact, venta.idTimbrado, timbrado.NumerTimbrado, venta.idCliente, cliente.Razon_social, venta.idtipo_venta, tipo_venta.Descripcion`

    if (id) {
        query += ` WHERE idventa = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("venta: ", res);
        result(null, res);
    });
};
Ventas.descargarFactura = (id, result) => {
    const objetoADevolver = {
        stamping: '',
        start: '',
        end: '',
        invoiceNumber: '',
        date: '',
        social_reason: '',
        document: '',
        condition: '',
        phone: '',
        detail: [
          {
            cant: '',
            description: '',
            price: '',
            exentas: '',
            iva5: '',
            iva10: ''
          }
        ],
        subTotals: {
          exentas: '',
          iva5: '',
          iva10: ''
        },
        total: {
          literal: '',
          amount: ''
        },
        iva: {
          iva5: '',
          iva10: '',
          total: ''
        }
    }

    let query = `
    SELECT idventa,
    venta.Fecha,
    venta.Numero_fact,
    venta.idCliente,
    cliente.Razon_social,
    cliente.Telefono,
    cliente.Ruc,
    venta.idTimbrado,
    timbrado.NumerTimbrado,
    timbrado.fecha_inicio,
    timbrado.fecha_fin,
    venta.idAperturacaja,
    venta.idCaja,
    venta.idtipo_venta,
    tipo_venta.Descripcion,
    venta.estado_venta
FROM  mydb.venta
JOIN cliente ON cliente.idCliente = venta.idCliente
JOIN timbrado ON timbrado.idTimbrado = venta.idTimbrado
JOIN tipo_venta ON tipo_venta.idtipo_venta = tipo_venta.idtipo_venta`

    if (id) {
        query += ` WHERE idventa = ${id}`;
    }

    const queryDetalle = `SELECT idventa,
    detalle_venta_cliente.idContrato,
    contrato.nombre_urbanizacion,
    detalle_venta_cliente.monto_total,
    detalle_venta_cliente.cantidad,
    detalle_venta_cliente.exenta,
    detalle_venta_cliente.iva5,
    detalle_venta_cliente.iva10
FROM mydb.detalle_venta_cliente
JOIN contrato ON contrato.idContrato = detalle_venta_cliente.idContrato
WHERE idventa = ?`

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        sql.query(queryDetalle, [res[0].idventa], (errDetalle, resDetalle) => {
            if (errDetalle) {
                console.log("error: ", errDetalle);
                result(errDetalle, null);
                return;
            }

            console.log("venta: ", res[0]);
            console.log("detalle: ", resDetalle);
            objetoADevolver.stamping = res[0].NumerTimbrado,
            objetoADevolver.start = dayjs(res[0].fecha_inicio).format('DD/MM/YYYY'),
            objetoADevolver.end = dayjs(res[0].fecha_fin).format('DD/MM/YYYY'),
            objetoADevolver.document = res[0].Ruc,
            objetoADevolver.phone = res[0].Telefono,
            objetoADevolver.date = res[0].Fecha,
            objetoADevolver.invoiceNumber = res[0].Numero_fact,
            objetoADevolver.social_reason = res[0].Razon_social,
            objetoADevolver.condition = res[0].Descripcion,
            objetoADevolver.detail = resDetalle.map(detalle => {
                return {
                    cant: detalle.cantidad,
                    description: detalle.nombre_urbanizacion,
                    price: detalle.monto_total,
                    exentas: detalle.exenta,
                    iva5: detalle.iva5,
                    iva10: detalle.iva10
                }
            }),
            objetoADevolver.subTotals = {
                exentas: resDetalle.reduce((acc, curr) => acc + curr.exenta, 0),
                iva5: resDetalle.reduce((acc, curr) => acc + curr.iva5, 0),
                iva10: resDetalle.reduce((acc, curr) => acc + curr.iva10, 0)
            },
            objetoADevolver.total = {
                literal: '',
                amount: resDetalle.reduce((acc, curr) => acc + curr.monto_total, 0)
            },
            objetoADevolver.iva = {
                iva5: resDetalle.reduce((acc, curr) => acc + curr.iva5, 0),
                iva10: resDetalle.reduce((acc, curr) => acc + curr.iva10, 0),
                total: resDetalle.reduce((acc, curr) => acc + curr.iva5 + curr.iva10, 0)
            }
            result(null, objetoADevolver);

        });
    });
    
};
Ventas.findById = (numeroFactura, result) => {
    const queryCabecera = `SELECT * FROM venta WHERE Numero_fact = ?`;

    const queryDetalle = `SELECT idventa,
    detalle_venta_cliente.idContrato,
    contrato.nombre_urbanizacion,
    detalle_venta_cliente.monto_total,
    detalle_venta_cliente.monto_total AS Total,
    detalle_venta_cliente.cantidad,
    detalle_venta_cliente.exenta,
    detalle_venta_cliente.iva5,
    detalle_venta_cliente.iva10
FROM mydb.detalle_venta_cliente
JOIN contrato ON contrato.idContrato = detalle_venta_cliente.idContrato
WHERE idventa = ?`;

    // Realiza ambas consultas en paralelo
    sql.query(queryCabecera,[numeroFactura], (errCabecera, resCabecera) => {
        if (errCabecera) {
            console.log("error: ", errCabecera);
            result(errCabecera, null);
            return;
        }

        // Si la cabecera se encuentra, realiza la consulta del detalle
        if (resCabecera.length) {
            const idventa = resCabecera[0].idventa;

            sql.query(queryDetalle, [idventa], (errDetalle, resDetalle) => {
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

                console.log("found venta: ", CompraC);
                result(null, CompraC);
            });
        } else {
            // No se encontró la venta con el id proporcionado
            result({ kind: "not_found" }, null);
        }
    });
};



module.exports = Ventas;


