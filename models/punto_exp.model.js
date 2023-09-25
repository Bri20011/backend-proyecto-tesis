const sql = require("../db.js");


// constructor
const Punto_exp = function (punto_exp) {
    this.idPunto_exp = punto_exp.idPunto_exp;
    this.descripcion = punto_exp.Descripcion;
    this.numer_punto_exp = punto_exp.Numer_punto_exp;
};


Punto_exp.create = (newPunto_exp, result) => {
    sql.query("SELECT idPunto_exp as id FROM punto_exp ORDER BY idPunto_exp DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO punto_exp (idPunto_exp, descripcion, numer_punto_exp)  VALUES (?, ?, ?)", [newId, newPunto_exp.descripcion, newPunto_exp.numer_punto_exp], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newPunto_exp });
        });
    })
};



Punto_exp.findById = (id, result) => {
    sql.query(`SELECT * FROM punto_exp WHERE idPunto_exp = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found punto_exp: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Punto_exp with the id
        result({ kind: "not_found" }, null);
    });
};

Punto_exp.getAll = (id, result) => {
    let query = "SELECT * FROM punto_exp";

    if (id) {
        query += ` WHERE idPunto_exp = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("punto_exp: ", res);
        result(null, res);
    });
};


Punto_exp.updateById = (id, punto_exp, result) => {   //agregar en esta linea si hay error, punto_exp
    sql.query(
        "UPDATE punto_exp SET descripcion = ?, Numer_punto_exp = ? WHERE idPunto_exp = ?",
        [punto_exp.descripcion, punto_exp.numer_punto_exp, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Punto_exp with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated punto_exp: ", { ...punto_exp });
            result(null, { ...punto_exp });
        }
    );
};

Punto_exp.remove = (id, result) => {
    sql.query("DELETE FROM punto_exp WHERE idPunto_exp = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Punto_exp with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted punto_exp with id: ", id);
        result(null, res);
    });
};


module.exports = Punto_exp;