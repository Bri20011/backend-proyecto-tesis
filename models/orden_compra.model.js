const sql = require("../db.js");


// constructor
const Orden_Compra = function(orden_compra) {
    this.idorden_compra = orden_compra.idorden_compra;
    this.descripcion = orden_compra.Descripcion;
  };
  
  Orden_Compra.create = (newOrden_Compra, result) => {

    sql.query("INSERT INTO orden_compra (idorden_compra, descripcion) VALUES (?, ?)", [newOrden_Compra.idorden_compra, newOrden_Compra.descripcion], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created orden_compra: ", {  ...newOrden_Compra });
      result(null, { ...newOrden_Compra });
    });
  };
  
  Orden_Compra.findById = (id, result) => {
    sql.query(`SELECT * FROM orden_compra WHERE idorden_compra = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found idorden_compra: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Orden_Compra with the id
      result({ kind: "not_found" }, null);
    });
  };
  
  Orden_Compra.getAll = (id, result) => {
    let query = "SELECT * FROM orden_compra";
  
    if (id) {
      query += ` WHERE idorden_compra = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("orden_compra: ", res);
      result(null, res);
    });
  };
 
 
  Orden_Compra.updateById = (id, orden_compra, result) => {
    sql.query(
      "UPDATE orden_compra SET descripcion = ? WHERE idorden_compra = ?",
      [orden_compra.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Orden_Compra with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated orden_compra: ", {...orden_compra });
        result(null, { ...orden_compra });
      }
    );
  };
  
  Orden_Compra.remove = (id, result) => {
    sql.query("DELETE FROM orden_compra WHERE idorden_compra = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Orden_Compra with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted orden_compra with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = Orden_Compra;