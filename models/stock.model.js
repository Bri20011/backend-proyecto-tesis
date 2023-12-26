const sql = require("../db.js");


// constructord
const Stock = function (stock) {
};


Stock.update = (parametro_id_producto, parametro_cantidad, parametro_operacion) => {

  // parametro_id_producto: Es el id del producto
  // parametro_cantidad: Es la cantidad a registrar
  // parametro_operacion: Tipo de operacion si es "true" es SUMA, "false" es RESTA

  let aux_cantidad;
  

  sql.query("SELECT idStock as id, idProducto, Cantidad FROM stock WHERE idProducto = ?;", [parametro_id_producto], (err, res) => {
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

    // Si currentId es 0 significa que no existe el stock y se procede a crear
    if (existStock === 0) {
        sql.query("INSERT INTO stock (idProducto, Cantidad) VALUES ( ?, ?);",
        [ parametro_id_producto, aux_cantidad], (err, res) => {
          if (err) {
            console.log("error: ", err);
            return;
          }
        });
    // Si ya existe solo se actualize el stock
    } else {
      sql.query("UPDATE stock SET Cantidad = ? WHERE idProducto = ?",
        [aux_cantidad, parametro_id_producto], (err, res) => {
          if (err) {
            console.log("error: ", err);
            return;
          }
        });
    }
  })
};

Stock.findById = (id, result) => {
  sql.query(`SELECT * FROM stock WHERE idStock = ${id}`, (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
      }

      if (res.length) {
          console.log("found stock: ", res[0]);
          result(null, res[0]);
          return;
      }

      // not found Stock with the id
      result({ kind: "not_found" }, null);
  });
};

Stock.getAll = (id, result) => {
  let query = `SELECT idStock,
  stock.idProducto,
  stock.Cantidad
FROM stock;`;

  if (id) {
      query += ` WHERE idStock = ${id}`;
  }

  sql.query(query, (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
      }

      console.log("stock: ", res);
      result(null, res);
  });
};
Stock.getAllbyTipo = (id, result) => {
  let query = 'SELECT stock.idStock, stock.idProducto, producto.Descripcion as nombreproducto, stock.Cantidad FROM stock JOIN producto ON producto.idProducto = stock.idProducto WHERE stock.idProducto = ?';

  sql.query(query, [id], (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
      }

      console.log("stock: ", res);
      result(null, res);
  });
};


module.exports = Stock;


