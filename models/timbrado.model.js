const sql = require("../db.js");


// constructord
const Timbrado = function (timbrado) {
    this.idTimbrado = timbrado.idTimbrado;
    this.Descripcion = timbrado.Descripcion;
    this.NumerTimbrado = timbrado.NumerTimbrado;
    this.fecha_inicio = timbrado.fecha_inicio;
    this.fecha_fin = timbrado.fecha_fin;
    this.idPunto_exp = timbrado.idPunto_exp;
    this.idEstablecimiento = timbrado.idEstablecimiento;
    this.idTipo_Documento = timbrado.idTipo_Documento;
};

Timbrado.create = (newTimbrado, result) => {
    sql.query("SELECT idTimbrado as id FROM timbrado ORDER BY idTimbrado DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO timbrado (idTimbrado, Descripcion, NumerTimbrado, fecha_inicio, fecha_fin, idPunto_exp, idEstablecimiento,idTipo_Documento ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [newId, newTimbrado.Descripcion, newTimbrado.NumerTimbrado, newTimbrado.fecha_inicio, newTimbrado.fecha_fin, newTimbrado.idPunto_exp, newTimbrado.idEstablecimiento, newTimbrado.idTipo_Documento], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newTimbrado });
        });
    })
};

Timbrado.findById = (id, result) => {
    sql.query(`SELECT * FROM timbrado WHERE idTimbrado = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found timbrado: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Timbrado with the id
        result({ kind: "not_found" }, null);
    });
};

Timbrado.getAll = (id, result) => {
    let query = `SELECT idTimbrado,
     timbrado.Descripcion,
     timbrado.NumerTimbrado,
     timbrado.fecha_inicio,
     timbrado.fecha_fin,
     timbrado.idPunto_exp,
     timbrado.Descripcion as nombreExpedicion,
     timbrado.idEstablecimiento,
	 timbrado.Descripcion as nombreEstablecimiento,
     timbrado.idTipo_Documento,
	 timbrado.Descripcion as nombreTipoDoc
FROM timbrado
JOIN punto_exp  ON timbrado.idPunto_exp = punto_exp.idPunto_exp
JOIN establecimiento  ON timbrado.idEstablecimiento = establecimiento.idEstablecimiento
JOIN tipo_documento  ON timbrado.idTipo_Documento = tipo_documento.idTipo_Documento;`;

    if (id) {
        query += ` WHERE idTimbrado = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("timbrado: ", res);
        result(null, res);
    });
};

Timbrado.getAllbyTipo = (id, result) => {
    let query = 'SELECT idTimbrado, Descripcion, NumerTimbrado, fecha_inicio, fecha_fin, idPunto_exp, idEstablecimiento, idTipo_Documento FROM  timbrado WHERE  idTimbrado = ?';

    sql.query(query, [id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("timbrado: ", res);
        result(null, res);
    });
};

Timbrado.updateById = (id, timbrado, result) => {   
    sql.query(
        "UPDATE timbrado SET Descripcion = ?, NumerTimbrado = ?, fecha_inicio = ? , fecha_fin = ? , idPunto_exp = ?, idEstablecimiento = ? , idTipo_Documento = ? WHERE idTimbrado = ?",
                    [timbrado.Descripcion, timbrado.NumerTimbrado, timbrado.fecha_inicio, timbrado.fecha_fin, timbrado.idPunto_exp, timbrado.idEstablecimiento,  timbrado.idTipo_Documento, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Timbrado with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated timbrado: ", { ...timbrado });
            result(null, { ...timbrado });
        }
    );
};

Timbrado.remove = (id, result) => {
    sql.query("DELETE FROM timbrado WHERE idTimbrado = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Timbrado with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted Timbrado with id: ", id);
        result(null, res);
    });
};


module.exports = Timbrado;