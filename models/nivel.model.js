const sql = require("../db.js");


// constructor
const Nivel = function(nivel) {
    this.idNivel = nivel.idNivel;
    this.descripcion = nivel.Descripcion;
  };
  
  Nivel.create = (newNivel, result) => {
    sql.query("SELECT idNivel as id FROM nivel ORDER BY idNivel DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO nivel (idNivel, descripcion)  VALUES (?, ?)", [newId, newNivel.descripcion], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newNivel });
        });
    })
};

  
  
Nivel.findById = (id, result) => {
    sql.query(`SELECT * FROM nivel WHERE idNivel = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found nivel: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Nivel with the id
      result({ kind: "not_found" }, null);
    });
  };
  



  Nivel.getAll = (id, result) => {
    let query = "SELECT * FROM nivel";
  
    if (id) {
      query += ` WHERE idNivel = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("nivel: ", res);
      result(null, res);
    });
  };
 
 
  Nivel.updateById = (id, nivel, result) => {
    sql.query(
      "UPDATE nivel SET descripcion = ? WHERE idNivel = ?",
      [nivel.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Nivel with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated nivel: ", {...nivel });
        result(null, { ...nivel });
      }
    );
  };
  
  Nivel.remove = (id, result) => {
    sql.query("DELETE FROM nivel WHERE idNivel = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Nivel with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted nivel with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = Nivel;