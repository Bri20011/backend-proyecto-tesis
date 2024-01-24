const sql = require("../db.js");


// constructord
const Cliente = function (cliente) {
    this.idCliente = cliente.idCliente;
    this.Ruc = cliente.Ruc;
    this.Razon_social = cliente.Razon_social;
    this.Direccion = cliente.Direccion;
    this.Telefono = cliente.Telefono;
    this.idBarrio = cliente.idBarrio;
    this.idCiudad = cliente.idCiudad;
};

Cliente.create = (newCliente, result) => {
    sql.query("SELECT idCliente as id FROM cliente ORDER BY idCliente DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO cliente (idCliente, Ruc, Razon_social, Direccion, Telefono, idBarrio, idCiudad) VALUES (?, ?, ?, ?, ?, ?, ?)", [newId, newCliente.Ruc, newCliente.Razon_social,  newCliente.Direccion, newCliente.Telefono, newCliente.idBarrio, newCliente.idCiudad], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newCliente });
        });
    })
};

Cliente.findById = (id, result) => {
    sql.query(`SELECT * FROM cliente WHERE idCliente = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found cliente: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Cliente with the id
        result({ kind: "not_found" }, null);
    });
};

Cliente.getAll = (id, result) => {
    let query = `SELECT idCliente,
    Ruc,
    Razon_social,
    Direccion,
    Telefono,
    b.idBarrio,
    b.descripcion as nombrebarrio,
    c.idCiudad,
	c.Descripcion as nombreciudad
FROM cliente 
JOIN barrio b ON b.idBarrio = cliente.idBarrio
JOIN ciudad c ON c.idCiudad = cliente.idCiudad;`;

    if (id) {
        query += ` WHERE idCliente = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("cliente: ", res);
        result(null, res);
    });
};


Cliente.updateById = (id, cliente, result) => {   
    sql.query(
        "UPDATE cliente SET Ruc = ?, Razon_social = ?, Direccion = ? , Telefono = ? , idBarrio = ?, idCiudad = ? WHERE idCliente = ?",
                    [cliente.Ruc, cliente.Razon_social, cliente.Direccion, cliente.Telefono, cliente.idBarrio, cliente.idCiudad, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Cliente with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated cliente: ", { ...cliente });
            result(null, { ...cliente });
        }
    );
};

Cliente.remove = (id, result) => {
    sql.query("DELETE FROM cliente WHERE idCliente = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Cliente with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted Cliente with id: ", id);
        result(null, res);
    });
};


module.exports = Cliente;