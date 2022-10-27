const express = require("express")
const app = express()
const ContainerProducts = require("./class")
const ContainerClass = new ContainerProducts()


app.listen(8080,()=>console.log("Server listening on port 8080"))

app.get("/",async (req,res)=>{
  res.json({})
})

app.get("/productos",async (req,res)=>{
  const allProducts = await ContainerClass.getAll()
  res.json(allProducts)
})

app.get("/productoRandom",async (req,res)=>{
  const allProducts = await ContainerClass.getAll()
  const randomId = Math.ceil(Math.random() * allProducts.length)
  const productRandom = await ContainerClass.getById(randomId)
  console.log(randomId)
  res.json(productRandom)
})