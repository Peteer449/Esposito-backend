const optionsSql = require("./options/mysqlConfig.js");
const knex = require("knex")

const database = knex(optionsSql)


class Container{
  async save(object){
    let exists = await database.schema.hasTable("allProducts")
    if(!exists){
      await database.schema.createTable("allProducts",table=>{
        table.increments("id")
        table.string("title",15).notNullable()
        table.string("price",10).notNullable()
        table.string("image").notNullable()
      })
    }
    return(
      await database("allProducts").insert(object)
      .then(()=>{console.log("producto agregado")})
      .catch(error=>console.error(error))
      )
  }
  async getAll(){return(
    await database.from("allProducts").select("*")
    .then(data=>{
      const results = data.map(e=>e)
      return results
    })
    .catch(err=>console.error(err))
    )
  }
}
/*
  getById(id){
    const object=products.find(e=>e.id===id)
    return object
  }
  deleteById(id){
    const itemToDelete=products.find(e=>e.id===id)
    const index = products.indexOf(itemToDelete)
    products.splice(index,1)
  }
  deleteAll(){
    products = []
  }
*/

module.exports = Container