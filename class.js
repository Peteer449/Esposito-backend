const fs = require("fs")

class Container{
  save(object){return(
    fs.promises.readFile("./products.txt","utf-8")
    .then(data=>{
      const contentJSON=JSON.parse(data) 
      const ids=contentJSON.map(e=>e.id)
      contentJSON.push({...object,id:ids.length+1})
      fs.promises.writeFile("./products.txt",JSON.stringify(contentJSON))
      return(ids.length+1)
    })
    .catch(error=>console.error(error))
  )}
  getById(id){return(
    fs.promises.readFile("./products.txt","utf-8")
    .then(data=>{
      const contentJSON=JSON.parse(data) 
      const object=contentJSON.find(e=>e.id===id)
      return object
    })
    .catch(err=>console.error(err))
  )}
  getAll(){return(
    fs.promises.readFile("./products.txt","utf-8")
    .then(data=>{
      const contentJSON=JSON.parse(data) 
      return contentJSON
    })
    .catch(err=>console.error(err))
  )}
  deleteById(id){return(
    fs.promises.readFile("./products.txt","utf-8")
    .then(data=>{
      const contentJSON=JSON.parse(data) 
      const itemToDelete=contentJSON.find(e=>e.id===id)
      const index = contentJSON.indexOf(itemToDelete)
      contentJSON.splice(index,1)
      fs.promises.writeFile("./products.txt",JSON.stringify(contentJSON))
    })
    .catch(err=>console.error(err))
  )}
  deleteAll(){return(
    fs.promises.writeFile("./products.txt","[]")
  )}
}

module.exports = Container
//const test = new Container
//test.save({title:"Pizza",price:1000})
//test.getById(3)
//test.getAll()
//test.deleteById(5)
//test.deleteAll()