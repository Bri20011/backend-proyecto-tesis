const sql = require("../db.js");
const Stock = require("./stock.model.js")


// constructord
const CuentaPagar = function (cuenta_pagar) {
    this.idcuenta_pagar = cuenta_pagar.idcuenta_pagar;
    this.proveedor = cuenta_pagar.proveedor;
    this.observacion = cuenta_pagar.observacion;
    this.Detalle = cuenta_pagar.Detalle;
};

CuentaPagar.create = (newCuentaPagar, idcompras) => {
    sql.query("SELECT idcuenta_pagar as id FROM cuenta_pagar ORDER BY idcuenta_pagar DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            return;
        }

        // newCuentaPagar = {
        //     "cabecera": {
        //         "observacion": "Tes Cuenta Pagar",
        //         "proveedor": 1,
        //         "fechaD": "",
        //         "monto": ""
        //     },
        //     "detalle": [
        //         {
        //             "fecha": "2024-02-29",
        //             "monto": "650000",
        //             "action": ""
        //         }
        //     ]
        // }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO cuenta_pagar (idcuenta_pagar, proveedor, observacion) VALUES (?, ?, ?)",
            [newId, newCuentaPagar.cabecera.proveedor, newCuentaPagar.cabecera.observacion], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    return;
                }

                const detalleFormateado = []
                newCuentaPagar.detalle.forEach(detalle => {
                    detalleFormateado.push(
                        [idcompras, newId, detalle.fecha, detalle.monto]
                    )
                })

                sql.query(`INSERT INTO detalle_cuenta_pagar_compra (idCompras, idcuenta_pagar, fecha_vto, monto_cuota) VALUES ?`,
                    [detalleFormateado], (e) => {
                        if (e) {
                            console.log("error: ", e);
                            return;
                        }
                    })
            });
    })
};
CuentaPagar.getAll = (id, result) => {
    let query = "SELECT * FROM cuenta_pagar WHERE idcuenta_pagar";

    let queryDetalle =
        `SELECT idCompras,
        detalle_cuenta_pagar_compra.idcuenta_pagar,
        detalle_cuenta_pagar_compra.fecha_vto,
        detalle_cuenta_pagar_compra.monto_cuota,
        detalle_cuenta_pagar_compra.estado
    FROM detalle_cuenta_pagar_compra
    WHERE idCompras =  ?`;

    if (id) {
        query += ` WHERE idcuenta_pagar = ${id}`;
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
                    [cabecera.idcuenta_pagar],
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






module.exports = CuentaPagar;


