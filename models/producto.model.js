const sql = require("../db.js");


// constructord
const Producto = function (producto) {
    this.idProducto = producto.idProducto;
    this.Descripcion = producto.Descripcion;
    this.Precio = producto.Precio;
    this.PrecioCompra = producto.PrecioCompra;
    this.idmarca = producto.idmarca;
    this.idcategoria = producto.idcategoria;
    this.idIva = producto.idIva;
};

Producto.create = (newProducto, result) => {
    sql.query("SELECT idProducto as id FROM producto ORDER BY idProducto DESC LIMIT 1", null, (err, res)=> {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        let currentId = res[0]?.id || 0
        let newId = currentId + 1

        sql.query("INSERT INTO producto (idProducto, Descripcion, Precio, PrecioCompra, idmarca, idcategoria, idIva) VALUES (?, ?, ?, ?, ?, ?, ?)", [newId, newProducto.Descripcion, newProducto.Precio,  newProducto.PrecioCompra, newProducto.idmarca, newProducto.idcategoria, newProducto.idIva], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
    
            
            result(null, { ...newProducto });
        });
    })
};

Producto.findById = (id, result) => {
    sql.query(`SELECT * FROM producto WHERE idProducto = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found producto: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Producto with the id
        result({ kind: "not_found" }, null);
    });
};

Producto.getAll = (id, result) => {
    let query = `SELECT idProducto,
    producto.Descripcion,
    producto.Precio,
    producto.PrecioCompra,
    producto.idmarca,
    marca.Descripcion as nombremarca,
    producto.idcategoria,
    categoria.Descripcion as nombrecategoria,
    producto.idIva,
    iva.Descripcion as nombreiva
FROM producto
JOIN marca  ON producto.idmarca = marca.idmarca
JOIN categoria ON producto.idcategoria = categoria.idcategoria
JOIN iva  ON producto.idIva = iva.idIva;`;

    if (id) {
        query += ` WHERE idProducto = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("producto: ", res);
        result(null, res);
    });
};

Producto.getAllbyTipo = (id, result) => {
    let query = `SELECT
    idProducto,
    Descripcion,
    Precio,
    PrecioCompra,
    idmarca,
    idcategoria,
    idIva,
    idTipo_productoUr
FROM
    producto
WHERE
    idTipo_productoUr = 1`;

    if (id) {
        query += ` WHERE idProducto = ${id}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("producto: ", res);
        result(null, res);
    });
};

Producto.updateById = (id, producto, result) => {   
    sql.query(
        "UPDATE producto SET Descripcion = ?, Precio = ?, PrecioCompra = ? , idmarca = ? , idcategoria = ?, idIva = ? WHERE idProducto = ?",
                    [producto.Descripcion, producto.Precio, producto.PrecioCompra, producto.idmarca, producto.idcategoria, producto.idIva, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Producto with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated producto: ", { ...producto });
            result(null, { ...producto });
        }
    );
};

Producto.remove = (id, result) => {
    sql.query("DELETE FROM producto WHERE idProducto = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Producto with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted Producto with id: ", id);
        result(null, res);
    });
};


module.exports = Producto;