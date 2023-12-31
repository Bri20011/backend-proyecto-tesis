const sql = require("../db.js");


// constructor
const Ciudad = function(ciudad) {
    this.idCiudad = ciudad.idCiudad;
    this.descripcion = ciudad.Descripcion;
  };
  
  Ciudad.create = (newCiudad, result) => {
    sql.query("SELECT idCiudad as id FROM ciudad ORDER BY idCiudad DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO ciudad (idCiudad, descripcion)  VALUES (?, ?)", [newId, newCiudad.descripcion], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newCiudad });
        });
    })
};

  
  
  Ciudad.findById = (id, result) => {
    sql.query(`SELECT * FROM ciudad WHERE idCiudad = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found ciudad: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Ciudad with the id
      result({ kind: "not_found" }, null);
    });
  };
  



  Ciudad.getAll = (id, result) => {
    let query = "SELECT * FROM ciudad";
  
    if (id) {
      query += ` WHERE idCiudad = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("ciudad: ", res);
      result(null, res);
    });
  };
 
 
  Ciudad.updateById = (id, ciudad, result) => {
    sql.query(
      "UPDATE ciudad SET descripcion = ? WHERE idCiudad = ?",
      [ciudad.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Ciudad with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated ciudad: ", {...ciudad });
        result(null, { ...ciudad });
      }
    );
  };
  
  Ciudad.remove = (id, result) => {
    sql.query("DELETE FROM ciudad WHERE idCiudad = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Ciudad with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted ciudad with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = Ciudad;