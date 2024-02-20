const sql = require("../db.js");


// constructord
const Stock_Lote = function (stock_lote) {
};


Stock_Lote.update = (parametro_id_producto, parametro_cantidad, parametro_operacion) => {

  // parametro_id_producto: Es el id del producto
  // parametro_cantidad: Es la cantidad a registrar
  // parametro_operacion: Tipo de operacion si es "true" es SUMA, "false" es RESTA

  let aux_cantidad;
  

  sql.query("SELECT idStock_Lote as id, idProducto, Cantidad FROM stock_lote WHERE idProducto = ?;", [parametro_id_producto], (err, res) => {
    if (err) {
      console.log("error: ", err);
      return;
    }

    let existStock = res[0]?.id || 0
    aux_cantidad = res[0]?.Cantidad || 0

    if (parametro_operacion) {
      aux_cantidad = aux_cantidad + parametro_cantidad
    } else {
      aux_cantidad = aux_cantidad - parametro_cantidad
    }

    // Si currentId es 0 significa que no existe el stock_lote y se procede a crear
    if (existStock === 0) {
        sql.query("INSERT INTO stock_lote (idProducto, Cantidad) VALUES ( ?, ?);",
        [ parametro_id_producto, aux_cantidad], (err, res) => {
          if (err) {
            console.log("error: ", err);
            return;
          }
        });
    // Si ya existe solo se actualize el stock_lote
    } else {
      sql.query("UPDATE stock_lote SET Cantidad = ? WHERE idProducto = ?",
        [aux_cantidad, parametro_id_producto], (err, res) => {
          if (err) {
            console.log("error: ", err);
            return;
          }
        });
    }
  })
};

Stock_Lote.findById = (id, result) => {
  sql.query(`SELECT * FROM stock_lote WHERE idStock_Lote = ${id}`, (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
      }

      if (res.length) {
          console.log("found stock_lote: ", res[0]);
          result(null, res[0]);
          return;
      }

      // not found Stock_Lote with the id
      result({ kind: "not_found" }, null);
  });
};

Stock_Lote.getAll = (id, result) => {
  let query = `SELECT idStock_Lote,
  stock_lote.idProducto,
  stock_lote.Cantidad
FROM stock_lote;`;

  if (id) {
      query += ` WHERE idStock_Lote = ${id}`;
  }

  sql.query(query, (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
      }

      console.log("stock_lote: ", res);
      result(null, res);
  });
};
Stock_Lote.getAllbyTipo = (id, result) => {
  let query = 'SELECT stock_lote.idStock_Lote, stock_lote.idProducto, producto.Descripcion as nombreproducto, stock_lote.Cantidad FROM stock_lote JOIN producto ON producto.idProducto = stock_lote.idProducto WHERE stock_lote.idProducto = ?';

  sql.query(query, [id], (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
      }

      console.log("stock_lote: ", res);
      result(null, res);
  });
};


module.exports = Stock_Lote;


