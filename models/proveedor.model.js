const sql = require("../db.js");


// constructord
const Proveedor = function (proveedor) {
    this.idProveedor = proveedor.idProveedor;
    this.Ruc = proveedor.Ruc;
    this.Razon_social = proveedor.Razon_social;
    this.Direccion = proveedor.Direccion;
    this.Telefono = proveedor.Telefono;
    this.idBarrio = proveedor.idBarrio;
    this.idCiudad = proveedor.idCiudad;
};

Proveedor.create = (newProveedor, result) => {
    sql.query("SELECT idProveedor as id FROM proveedor ORDER BY idProveedor DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO proveedor (idProveedor, Ruc, Razon_social, Direccion, Telefono, idBarrio, idCiudad) VALUES (?, ?, ?, ?, ?, ?, ?)", [newId, newProveedor.Ruc, newProveedor.Razon_social,  newProveedor.Direccion, newProveedor.Telefono, newProveedor.idBarrio, newProveedor.idCiudad], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newProveedor });
        });
    })
};

Proveedor.findById = (id, result) => {
    sql.query(`SELECT * FROM proveedor WHERE idProveedor = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found proveedor: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Proveedor with the id
        result({ kind: "not_found" }, null);
    });
};

Proveedor.getAll = (id, result) => {
    let query = `SELECT idProveedor,
    Ruc,
    Razon_social,
    Direccion,
    Telefono,
    b.idBarrio,
    b.descripcion as nombrebarrio,
    c.idCiudad,
	c.Descripcion as nombreciudad
FROM proveedor 
JOIN barrio b ON b.idBarrio = proveedor.idBarrio
JOIN ciudad c ON c.idCiudad = proveedor.idCiudad;`;

    if (id) {
        query += ` WHERE idProveedor = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("proveedor: ", res);
        result(null, res);
    });
};


Proveedor.updateById = (id, proveedor, result) => {   
    sql.query(
        "UPDATE proveedor SET Ruc = ?, Razon_social = ?, Direccion = ? , Telefono = ? , idBarrio = ?, idCiudad = ? WHERE idProveedor = ?",
                    [proveedor.ruc, proveedor.Razon_social, proveedor.Direccion, proveedor.Telefono, proveedor.idBarrio, proveedor.idCiudad, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Proveedor with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated proveedor: ", { ...proveedor });
            result(null, { ...proveedor });
        }
    );
};

Proveedor.remove = (id, result) => {
    sql.query("DELETE FROM proveedor WHERE idProveedor = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Proveedor with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted Proveedor with id: ", id);
        result(null, res);
    });
};


module.exports = Proveedor;