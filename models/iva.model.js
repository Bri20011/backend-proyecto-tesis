const sql = require("../db.js");


// constructor
const Iva = function (iva) {
    this.idIva = iva.idIva;
    this.descripcion = iva.Descripcion;
    this.porcentaje = iva.Porcentaje;
};

Iva.create = (newIva, result) => {
    sql.query("SELECT idIva as id FROM iva ORDER BY idIva DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO iva (idIva, descripcion, porcentaje)  VALUES (?, ?, ?)", [newId, newIva.descripcion, newIva.porcentaje], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newIva });
        });
    })
};

Iva.findById = (id, result) => {
    sql.query(`SELECT * FROM iva WHERE idIva = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found iva: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Iva with the id
        result({ kind: "not_found" }, null);
    });
};

Iva.getAll = (id, result) => {
    let query = "SELECT * FROM iva";

    if (id) {
        query += ` WHERE idIva = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("iva: ", res);
        result(null, res);
    });
};


Iva.updateById = (id, iva, result) => {   
    sql.query(
        "UPDATE iva SET descripcion = ?, Porcentaje = ? WHERE idIva = ?",
        [iva.descripcion, iva.porcentaje, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Iva with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated iva: ", { ...iva });
            result(null, { ...iva });
        }
    );
};

Iva.remove = (id, result) => {
    sql.query("DELETE FROM iva WHERE idIva = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Iva with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted iva with id: ", id);
        result(null, res);
    });
};


module.exports = Iva;