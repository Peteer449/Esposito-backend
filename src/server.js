const fs = require("fs")
const express = require("express")
const multer = require("multer")
const {Server} = require("socket.io")
const path = require("path")
const bodyParser = require("body-parser")
const app = express()
const handlebars = require("express-handlebars")


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())
app.engine("handlebars",handlebars.engine())
app.set("views",path.join(__dirname,"views"))
app.set("view engine","handlebars")
app.use(express.static("../uploads"));
app.use(express.static("./views"))


//Port of the server
const PORT = process.env.PORT || 8080

//Import classes
const ContainerProducts = require("./class")
const ContainerClass = new ContainerProducts()
const routerContainer = require("./routerClass")
const { nextTick } = require("process")
const routerClass = new routerContainer()
const ChatContainer = require("./chatClass")
const chatClass = new ChatContainer()

//Server listener
const server = app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))

//Create websocket server
const io = new Server(server)

io.on("connection",async (socket)=>{
  socket.emit("allMessages",await chatClass.getAll())
  socket.emit("allProducts",await routerClass.getAll())
  socket.on("chatInput",async data=>{
    io.sockets.emit("allMessages", await chatClass.save(data))
  })
  socket.on("addProduct",data=>{
    routerClass.save(data)
    io.sockets.emit("allProducts",routerClass.getAll())
  })
})

//Products router
const routerProducts = express.Router()

//multer storage
let storage = multer.diskStorage({
  destination:(req,file,callback)=>{
    callback(null,"../uploads")
  },
  filename:(req,file,callback)=>{
    callback(null,Date.now() + "-" + file.fieldname + file.originalname)
  }
})

const upload = multer({storage})

//Index of the page
app.get('/', (req, res) => {
  res.render("home")
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
  //res.render("home")
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
  const allProducts = await routerClass.getAll()
  if(allProducts.length){
    res.render("products",{allProducts})
  }else{
    res.render("productsEmpty")
  }
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