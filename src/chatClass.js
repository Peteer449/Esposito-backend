const fs = require("fs")

class Container{
  save(object){return(
    fs.promises.readFile("./chatLog.txt","utf-8")
    .then((data)=>{
      const contentJSON=JSON.parse(data) 
      contentJSON.push(object)
      fs.promises.writeFile("./chatLog.txt",JSON.stringify(contentJSON))
      return contentJSON
    })
    .catch(error=>console.error(error))
  )}
  getAll(){return(
    fs.promises.readFile("./chatLog.txt","utf-8")
    .then((data)=>{
      const contentJSON=JSON.parse(data) 
      return contentJSON
    })
    .catch(error=>console.error(error))
  )}
}

module.exports = Container