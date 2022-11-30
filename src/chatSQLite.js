const optionsSqlite = require("./options/sqliteConfig.js");
const knex = require("knex")

const database = knex(optionsSqlite)


class Container{
  async save(object){
    let exists = await database.schema.hasTable("mensajes")
    if(!exists){
      await database.schema.createTable("mensajes",table=>{
        table.increments("id")
        table.string("user",15).notNullable()
        table.string("date",10).notNullable()
        table.string("message").notNullable()
      })
    }
    return(
      await database("mensajes").insert(object)
      .then(()=>{console.log("mensaje agregado")})
      .catch(error=>console.error(error))
      )
  }
  async getAll(){return(
    await database.from("mensajes").select("*")
    .then(data=>{
      const results = data.map(e=>e)
      return results
    })
    .catch(err=>console.error(err))
    )
  }
}

module.exports = Container