const sql = require("../db.js");


// constructor
const Categoria = function(categoria) {
    this.idcategoria = categoria.idcategoria;
    this.descripcion = categoria.Descripcion;
  };
  
  Categoria.create = (newCategoria, result) => {

    sql.query("INSERT INTO categoria (idcategoria, descripcion) VALUES (?, ?)", [newCategoria.idcategoria, newCategoria.descripcion], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created categoria: ", {  ...newCategoria });
      result(null, { ...newCategoria });
    });
  };
  
  Categoria.findById = (id, result) => {
    sql.query(`SELECT * FROM categoria WHERE idcategoria = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found categoria: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Categoria with the id
      result({ kind: "not_found" }, null);
    });
  };
  
  Categoria.getAll = (id, result) => {
    let query = "SELECT * FROM categoria";
  
    if (id) {
      query += ` WHERE idcategoria = ${id}`;
    }
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("categoria: ", res);
      result(null, res);
    });
  };
 
 
  Categoria.updateById = (id, categoria, result) => {
    sql.query(
      "UPDATE categoria SET descripcion = ? WHERE idcategoria = ?",
      [categoria.descripcion, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found categoria with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated categoria: ", {...categoria });
        result(null, { ...categoria });
      }
    );
  };
  
  Categoria.remove = (id, result) => {
    sql.query("DELETE FROM categoria WHERE idcategoria = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Categoria with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted categoria with id: ", id);
      result(null, res);
    });
  };
  
  
  module.exports = Categoria;