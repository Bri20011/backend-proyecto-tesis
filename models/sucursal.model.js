const sql = require("../db.js");


// constructor
const Sucursal = function(sucursal) {
    this.idSucursal = sucursal.idSucursal;
    this.descripcion = sucursal.Descripcion;
  };
  


  Sucursal.create = (newSucursal, result) => {
    sql.query("SELECT idSucursal as id FROM sucursal ORDER BY idSucursal DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO sucursal (idSucursal, descripcion)  VALUES (?, ?)", [newId, newSucursal.descripcion], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newSucursal });
        });
    })
};



  Sucursal.findById = (id, result) => {
    sql.query(`SELECT * FROM sucursal WHERE idSucursal = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found sucursal: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Sucursal with the id
      result({ kind: "not_found" }, null);
    });
  };
  
  Sucursal.getAll = (id, result) => {
    let query = "SELECT * FROM sucursal";
  
    if (id) {
      query += ` WHERE idSucursal = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("sucursal: ", res);
      result(null, res);
    });
  };
 
 
  Sucursal.updateById = (id, sucursal, result) => {
    sql.query(
      "UPDATE sucursal SET descripcion = ? WHERE idSucursal = ?",
      [sucursal.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Sucursal with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated sucursal: ", {...sucursal });
        result(null, { ...sucursal });
      }
    );
  };
  
  Sucursal.remove = (id, result) => {
    sql.query("DELETE FROM sucursal WHERE idSucursal = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Sucursal with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted sucursal with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = Sucursal;