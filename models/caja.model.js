const sql = require("../db.js");


// constructord
const Caja = function (caja) {
    this.idCaja = caja.idCaja;
    this.nombrecaja = caja.nombrecaja;
    this.Cajahabilitada = caja.Cajahabilitada;
    this.idSucursal = caja.idSucursal;
};

Caja.create = (newCaja, result) => {
    sql.query("SELECT idCaja as id FROM caja ORDER BY idCaja DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO caja (idCaja, nombrecaja, Cajahabilitada, idSucursal) VALUES (?, ?, ?, ?)", [newId, newCaja.nombrecaja, newCaja.Cajahabilitada, newCaja.idSucursal], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newCaja });
        });
    })
};

Caja.findById = (id, result) => {
    sql.query(`SELECT * FROM caja WHERE idCaja = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found caja: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Caja with the id
        result({ kind: "not_found" }, null);
    });
};

Caja.getAll = (id, result) => {
    let query = `SELECT 
    idCaja,
    nombrecaja,
    Cajahabilitada,
    sucursal.idSucursal,
    sucursal.descripcion as nombreSucursal
    FROM caja JOIN sucursal ON sucursal.idSucursal = caja.idSucursal`;

    if (id) {
        query += ` WHERE idCaja = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("caja: ", res);
        result(null, res);
    });
};


Caja.updateById = (id, caja, result) => {   
    sql.query(
        "UPDATE caja SET nombrecaja = ?, Cajahabilitada = ?, idSucursal = ? WHERE idCaja = ?",
        [caja.nombrecaja, caja.Cajahabilitada, caja.idSucursal, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Caja with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated caja: ", { ...caja });
            result(null, { ...caja });
        }
    );
};

Caja.remove = (id, result) => {
    sql.query("DELETE FROM caja WHERE idCaja = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Caja with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted caja with id: ", id);
        result(null, res);
    });
};


module.exports = Caja;