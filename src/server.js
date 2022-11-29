const express = require("express")
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
app.use(express.static("./views"))


//Port of the server
const PORT = process.env.PORT || 8080

//Import classes
const productsContainer = require("./productsSQL")
const productsClass = new productsContainer()
const ChatContainer = require("./chatSQLite")
const chatClass = new ChatContainer()

//Server listener
const server = app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))

//Create websocket server
const io = new Server(server)

io.on("connection",async (socket)=>{
  socket.emit("allMessages",await chatClass.getAll())
  socket.emit("allProducts",await productsClass.getAll())
  socket.on("chatInput",async data=>{
    await chatClass.save(data)
    io.sockets.emit("allMessages",await chatClass.getAll())
  })
  socket.on("addProduct",async data=>{
    await productsClass.save(data)
    io.sockets.emit("allProducts",await productsClass.getAll())
  })
})

//Products router
const routerProducts = express.Router()

//Index of the page
app.get('/', (req, res) => {
  res.render("home")
});

//Delete a product by id
routerProducts.delete("/:id",async(req,res)=>{
  const id = req.params.id
  await productsClass.deleteById(parseInt(id))
  const allProducts = await productsClass.getAll()
  res.json(allProducts)
})

//Update a product by id
routerProducts.put("/:id",async(req,res)=>{
  const id =  req.params.id
  const product = await productsClass.getById(parseInt(id))
  product.actualizado = "Actualizado"
  const allProducts = await productsClass.getAll()
  res.json(allProducts)
})

//Add a new item in routerProducts
routerProducts.post("/" , async(req,res)=>{
  const title = req.body.title
  const price = req.body.price
  const file = req.file
  await productsClass.save({title,price,file})
})

//Get one item from the routerProducts
routerProducts.get("/:id",async(req,res)=>{
  const id = req.params.id
  const product = await productsClass.getById(parseInt(id))
  if(!product){
    res.json({error:'producto no encontrado'})
  }
  res.json(product)
})

//Get all the products from the router class
routerProducts.get("/",async(req,res)=>{
  const allProducts = await productsClass.getAll()
  res.render("products",{allProducts})
})

//Define the path of the router
app.use("/api/productos", routerProducts)