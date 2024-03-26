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
            [newId || 1, newContrato.idListado_precio.id, newContrato.nombre_urbanizacion, newContrato.fecha_contrato, newContrato.idCliente, newContrato.idCiudad, newContrato.idtipo_venta, newContrato.ubicacion, newContrato.numero_manzana, newContrato.numero_lote], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                const detalleFormateado = []
                console.log('New Contrato: ', newContrato)
                newContrato.Detalle.forEach(detalle => {
                    detalleFormateado.push(
                        [newId, detalle.fecha_vto || '2021-01-15', detalle.importe_cuota || 0, detalle.cantidad_cuota || 0, detalle.monto_contado || 0, detalle.id_detalle]
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
    let query = `SELECT 
    contrato.idContrato,
    contrato.idListado_precio,
    MAX(detalle_listado_precio.precioCredito) as precioCredito,
	MAX(detalle_listado_precio.precioContado) as precioContado,
    MAX(contrato.nombre_urbanizacion) as nombre_urbanizacion,
    MAX(contrato.fecha_contrato) as fecha_contrato,
    MAX(contrato.idCliente) as idCliente,
    MAX(cliente.Razon_social) as nombreCliente,
    MAX(cliente.Ruc) as rucCliente,
    MAX(cliente.Direccion) as direccionCliente,
    MAX(ciudadCli.Descripcion) AS ciudadCliente,
    MAX(contrato.idCiudad) as idCiudad, 
	MAX(ciudad.Descripcion) as nombreciudad,
    MAX(contrato.idtipo_venta) as idtipo_venta,
    MAX(tipo_venta.Descripcion) as nombretipoventa,
    MAX(contrato.ubicacion) as ubicacion,
    MAX(contrato.numero_manzana) as numero_manzana,
    MAX(contrato.numero_lote) as numero_lote
FROM contrato
JOIN cliente ON cliente.idCliente = contrato.idCliente
JOIN ciudad AS ciudadCli ON ciudadCli.idCiudad = cliente.idCiudad
JOIN ciudad ON ciudad.idCiudad = contrato.idCiudad
JOIN tipo_venta ON tipo_venta.idtipo_venta = contrato.idtipo_venta
JOIN detalle_listado_precio ON detalle_listado_precio.idListado_precio = contrato.idListado_precio
GROUP BY contrato.idContrato, contrato.idListado_precio`;


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


Contrato.update = (id, result) => {
    //Aqui va el update, cambia a true el estado_contrato
    console.log("Updating state of contrato with ID: ", id);
    sql.query("UPDATE contrato SET estado_contrato = true WHERE idContrato = ?", [id], (err, res) => {
        if (err) {
            console.log("error updating contrato: ", err);
            result(err, null);
            return;
        }
        result(null, { id: id, estado_contrato: true });
    });
};
Contrato.findById = (id, result) => {
    const queryCabecera = `SELECT idContrato,
    contrato.idListado_precio,
    contrato.nombre_urbanizacion,
    contrato.fecha_contrato,
    contrato.idCliente,
    contrato.idCiudad,
    contrato.idtipo_venta,
    tipo_venta.Descripcion as nombreTipoVenta,
    contrato.ubicacion,
    contrato.numero_manzana,
    contrato.numero_lote,
    (SELECT SUM(importe_cuota + monto_contado) FROM detalle_contrato WHERE idContrato = contrato.idContrato) as monto_totalNuevo
FROM contrato
JOIN tipo_venta ON tipo_venta.idtipo_venta = contrato.idtipo_venta
WHERE idContrato = ?`;

    const queryDetalle = `SELECT id_detalle,
    detalle_contrato.idContrato,
    detalle_contrato.fecha_vto,
    detalle_contrato.importe_cuota,
    detalle_contrato.cantidad_cuota,
	detalle_contrato.monto_contado
FROM detalle_contrato
WHERE idContrato = ?`;

    // Realiza ambas consultas en paralelo
    sql.query(queryCabecera,[id], (errCabecera, resCabecera) => {
        if (errCabecera) {
            console.log("error: ", errCabecera);
            result(errCabecera, null);
            return;
        }

        // Si la cabecera se encuentra, realiza la consulta del detalle
        if (resCabecera.length) {
            const idContrato = resCabecera[0].idContrato;

            sql.query(queryDetalle, [idContrato], (errDetalle, resDetalle) => {
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

module.exports = Contrato;


