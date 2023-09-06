const sql = require("../db.js");


// constructor
const Barrio = function(barrio) {
    this.idBarrio = barrio.idBarrio;
    this.descripcion = barrio.descripcion;
  };
  
  Barrio.create = (newBarrio, result) => {

    sql.query("INSERT INTO barrio (idBarrio, descripcion) VALUES (?, ?)", [newBarrio.idBarrio, newBarrio.descripcion], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created barrio: ", {  ...newBarrio });
      result(null, { ...newBarrio });
    });
  };
  
  Barrio.findById = (id, result) => {
    sql.query(`SELECT * FROM barrio WHERE idBarrio = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found barrio: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found barrio with the id
      result({ kind: "not_found" }, null);
    });
  };
  
  Barrio.getAll = (id, result) => {
    let query = "SELECT * FROM barrio";
  
    if (id) {
      query += ` WHERE idBarrio = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("barrio: ", res);
      result(null, res);
    });
  };
 
 
  Barrio.updateById = (id, barrio, result) => {
    sql.query(
      "UPDATE barrio SET descripcion = ? WHERE idBarrio = ?",
      [barrio.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found barrio with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated barrio: ", {...barrio });
        result(null, { ...barrio });
      }
    );
  };
  
  Barrio.remove = (id, result) => {
    sql.query("DELETE FROM barrio WHERE idBarrio = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found barrio with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted barrio with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = Barrio;