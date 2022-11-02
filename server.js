const express = require("express")
const multer = require("multer")
const bodyParser = require("body-parser")
const app = express()
const {Router} = require("express")
const {appendFile} = require("fs")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())

//Port of the server
const PORT = 8080

//Import class 
const ContainerProducts = require("./class")
const ContainerClass = new ContainerProducts()

//import routerClass
const routerContainer = require("./routerClass")
const { nextTick } = require("process")
const routerClass = new routerContainer()

app.use(express.static("public"))

//Server listener
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))

//Products router
const routerProducts = Router()

//multer storage
let storage = multer.diskStorage({
  destination:(req,file,callback)=>{
    callback(null,"uploads")
  },
  filename:(req,file,callback)=>{
    callback(null,Date.now() + "-" + file.fieldname + file.originalname)
  }
})

const upload = multer({storage})

//Index of the page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
});

//Delete a product by id
routerProducts.delete("/:id",async(req,res)=>{
  const id = req.params.id
  await routerClass.deleteById(parseInt(id))
  const allProducts = await routerClass.getAll()
  res.json(allProducts)
})

//Update a product by id
routerProducts.put("/:id",async(req,res)=>{
  const id =  req.params.id
  const product = await routerClass.getById(parseInt(id))
  product.actualizado = "Actualizado"
  const allProducts = await routerClass.getAll()
  res.json(allProducts)
})

//Add a new item in routerProducts
routerProducts.post("/" , upload.single("myFile") , async(req,res,next)=>{
  const title = req.body.title
  const price = req.body.price
  const file = req.file
  if(!file){
    const error = new Error("Archivo vacio")
    error.httpStatusCode = 400
    return next(error)
  }
  const newProductId = await routerClass.save({title,price,file})
  res.json({title,price,file,id:newProductId})
})

//Get one item from the routerProducts
routerProducts.get("/:id",async(req,res)=>{
  const id = req.params.id
  const product = await routerClass.getById(parseInt(id))
  if(!product){
    res.json({error:'producto no encontrado'})
  }
  res.json(product)
})

//Get all the products from the router class
routerProducts.get("/",async(req,res)=>{
  const allProducts = await routerClass.getAll()
  res.json(allProducts)
})

//Get all the products from the class
app.get("/productos",async (req,res)=>{
  const allProducts = await ContainerClass.getAll()
  res.json(allProducts)
})

//Get a random product from the class
app.get("/productoRandom",async (req,res)=>{
  const allProducts = await ContainerClass.getAll()
  const randomId = Math.ceil(Math.random() * allProducts.length)
  const productRandom = await ContainerClass.getById(randomId)
  console.log(randomId)
  res.json(productRandom)
})

//Define the path of the router
app.use("/api/productos", routerProducts)