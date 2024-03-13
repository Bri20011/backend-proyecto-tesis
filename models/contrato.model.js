const sql = require("../db.js");


// constructord
const Contrato = function (contrato) {
    this.idContrato = contrato.idContrato;
    this.idListado_precio = contrato.idListado_precio;
    this.nombre_urbanizacion = contrato.nombre_urbanizacion;
    this.fecha_contrato = contrato.fecha_contrato;
    this.idCliente = contrato.idCliente;
    this.idCiudad = contrato.idCiudad;
    this.idtipo_venta = contrato.idtipo_venta;
    this.ubicacion = contrato.ubicacion;
    this.numero_manzana = contrato.numero_manzana;
    this.numero_lote = contrato.numero_lote;
    this.Detalle = contrato.Detalle;
    
};

Contrato.create = (newContrato, result) => {
    sql.query("SELECT idContrato as id FROM contrato ORDER BY idContrato DESC LIMIT 1", null, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO contrato (idContrato, idListado_precio, nombre_urbanizacion, fecha_contrato, idCliente, idCiudad, idtipo_venta, ubicacion, numero_manzana, numero_lote) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [newId||1, newContrato.idListado_precio.id, newContrato.nombre_urbanizacion, newContrato.fecha_contrato, newContrato.idCliente, newContrato.idCiudad, newContrato.idtipo_venta, newContrato.ubicacion, newContrato.numero_manzana, newContrato.numero_lote], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                const detalleFormateado = []
                console.log('New Contrato: ', newContrato)
                newContrato.Detalle.forEach(detalle => {
                    detalleFormateado.push(
                        [newId, detalle.fecha_vto||'2021-01-15', detalle.importe_cuota||0, detalle.cantidad_cuota||0, detalle.monto_contado||0, detalle.id_detalle]  
                    )
                })

                sql.query(`INSERT INTO detalle_contrato (idContrato, fecha_vto, importe_cuota, cantidad_cuota, monto_contado,  id_detalle) VALUES ?`,
                    [detalleFormateado], (e) => {
                        if (e) {
                            console.log("error: ", e);
                            result(e, null);
                            return;
                        }

                        result(null, { ...newContrato });
                    })
            });
    })
};



Contrato.getAll = (id, result) => {
    let query = `SELECT idContrato,
    contrato.idListado_precio,
    contrato.nombre_urbanizacion,
    contrato.fecha_contrato,
    contrato.idCliente,
    cliente.Razon_social as nombreCliente,
    cliente.Ruc as rucCliente,
    cliente.Direccion as direccionCliente,
    ciudadCli.Descripcion AS ciudadCliente,
    contrato.idCiudad, 
	ciudad.Descripcion as nombreciudad,
    contrato.idtipo_venta,
    tipo_venta.Descripcion as nombretipoventa,
    contrato.ubicacion,
    contrato.numero_manzana,
    contrato.numero_lote
FROM contrato
JOIN cliente ON cliente.idCliente = contrato.idCliente
JOIN ciudad AS ciudadCli ON ciudadCli.idCiudad = cliente.idCiudad
JOIN ciudad ON ciudad.idCiudad = contrato.idCiudad
JOIN tipo_venta ON tipo_venta.idtipo_venta = contrato.idtipo_venta`;


    let queryDetalle = `SELECT idContrato,
    detalle_contrato.fecha_vto,
    detalle_contrato.importe_cuota,
    detalle_contrato.cantidad_cuota,
    detalle_contrato.monto_contado,
    detalle_contrato.id_detalle
    FROM detalle_contrato
WHERE idContrato  = ?`;

    if (id) {
        query += ` WHERE idContrato = ${id}`;
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
                    [cabecera.idContrato],
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

        
        result(null, cabeceraConDetalle);
    });
};





module.exports = Contrato;


