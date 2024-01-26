const sql = require("../db.js");


// constructor
const Efectivo = function(efectivo) {
    this.idefectivo = efectivo.idefectivo;
    this.Descripcion = efectivo.Descripcion;
    this.idmoneda = efectivo.idmoneda;
  };
  

  Efectivo.create = (newEfectivo, result) => {
    sql.query("SELECT idefectivo as id FROM efectivo ORDER BY idefectivo DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO efectivo (idefectivo, Descripcion, idmoneda)  VALUES (?, ?, ?)", [newId, newEfectivo.Descripcion, newEfectivo.idmoneda], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newEfectivo });
        });
    })
};
  



Efectivo.findById = (id, result) => {
    sql.query(`SELECT * FROM efectivo WHERE idefectivo = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found efectivo: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found efectivo with the id
      result({ kind: "not_found" }, null);
    });
  };
  
  Efectivo.getAll = (id, result) => {
    let query =`SELECT idefectivo,
    efectivo.Descripcion,
    efectivo.idmoneda 
FROM efectivo;`;
  
    if (id) {
      query += ` WHERE idefectivo = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("efectivo: ", res);
      result(null, res);
    });
  };
 
 
  Efectivo.updateById = (id, efectivo, result) => {
    sql.query(
      "UPDATE efectivo SET Descripcion = ?, idmoneda = ? WHERE idefectivo = ?",
      [efectivo.Descripcion, efectivo.idmoneda, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found efectivo with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated efectivo: ", {...efectivo });
        result(null, { ...efectivo });
      }
    );
  };
  
  Efectivo.remove = (id, result) => {
    sql.query("DELETE FROM efectivo WHERE idefectivo = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found efectivo with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted efectivo with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = Efectivo;