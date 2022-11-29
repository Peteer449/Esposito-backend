const options = {
  //a que gestor me conecto
  client:"mysql",
  //cuales son los paramentreos para conectarme a una vase de datos
  connection:{
    host:"127.0.0.1",//host por defecto de xampp
    user:"root",
    password:"",
    database:"products"
  }
}

module.exports = options