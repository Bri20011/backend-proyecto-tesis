const sql = require("../db.js");


// constructor
const Manzana = function(manzana) {
    this.idManzana = manzana.idManzana;
    this.numero_manzana = manzana.numero_manzana;
    this.descripcion = manzana.Descripcion;
  };
  
  Manzana.create = (newManzana, result) => {
    sql.query("SELECT idManzana as id FROM manzana ORDER BY idManzana DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO manzana (idManzana, descripcion, numero_manzana)  VALUES (?, ?, ?)", [newId, newManzana.numero_manzana, newManzana.descripcion], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newManzana });
        });
    })
};

  
  
Manzana.findById = (id, result) => {
    sql.query(`SELECT * FROM manzana WHERE idManzana = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found manzana: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Manzana with the id
      result({ kind: "not_found" }, null);
    });
  };
  



  Manzana.getAll = (id, result) => {
    let query = "SELECT * FROM manzana";
  
    if (id) {
      query += ` WHERE idManzana = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("manzana: ", res);
      result(null, res);
    });
  };
 
 
  Manzana.updateById = (id, manzana, result) => {
    sql.query(
      "UPDATE manzana SET numero_manzana = ?, Descripcion = ? WHERE idManzana = ?",
      [manzana.numero_manzana, manzana.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Manzana with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated manzana: ", {...manzana });
        result(null, { ...manzana });
      }
    );
  };
  
  Manzana.remove = (id, result) => {
    sql.query("DELETE FROM manzana WHERE idManzana = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Manzana with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted manzana with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = Manzana;