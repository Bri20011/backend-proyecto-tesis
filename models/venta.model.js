const sql = require("../db.js");
const Stock = require("./stock.model.js")
const CuentaPagar = require("./cuenta_pagar_compra.model.js")


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
                        result(null, { ...newVenta });
                    })
               

            });
    })
};


Ventas.getAll = (id, result) => {
    let query = `SELECT venta.*,
    cliente.Razon_social AS Razon_social_Cliente
FROM venta
JOIN cliente ON venta.idCliente = cliente.idCliente
WHERE venta.estado_venta = false`;

    let queryDetalle =
        `SELECT idventa,
    detalle_venta_cliente.idContrato,
    detalle_venta_cliente.monto_total,
    detalle_venta_cliente.cantidad
FROM detalle_venta_cliente
WHERE idventa =  ?`;

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



module.exports = Ventas;


