const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const app = express()
const handlebars = require("express-handlebars")

const isAdmin = true

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())
app.engine("handlebars",handlebars.engine())
app.set("views",path.join(__dirname,"views"))
app.set("view engine","handlebars")
app.use(express.static("./views"))


//Port of the server
const PORT = process.env.PORT || 8080

//Import classes
const ProductsClass = require("./ProductsClass")
const productClass = new ProductsClass()
const CartClass = require("./CartClass")
const cartClass = new CartClass()

//Server listener
const server = app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))

//Routers
const routerProducts = express.Router()
const routerCart = express.Router()

//Index of the page
app.get('/', (req, res) => {
  res.render("home")
});

app.get("*",(req,res) => {
  res.json({"error":"Ruta no implementada"})
})

//Delete a product by id
routerProducts.delete("/:id",async(req,res)=>{
  if(isAdmin){
    const id = req.params.id
    await productClass.deleteById(parseInt(id))
    const allProducts = await productClass.getAll()
    res.json(allProducts)
  }else{
    res.json({"error":"No tienes permiso de administrador"})
  }
})

//Update a product by id
routerProducts.put("/:id",async(req,res)=>{
  if(isAdmin){
    const id =  req.params.id
    const product = await productClass.getById(parseInt(id))
    product.actualizado = "Actualizado"
    const allProducts = await productClass.getAll()
    res.json(allProducts)
  }else{
    res.json({"error":"No tienes permiso de administrador"})
  }
})

//Add a new item in routerProducts
routerProducts.post("/", (req,res)=>{
  if(isAdmin){
    const title = req.body.title
    const description = req.body.description
    const price = req.body.price
    const stock = req.body.stock
    const image = req.body.image
    const code = req.body.code
    productClass.save({title,description,time:new Date().toLocaleTimeString(),price,stock,code,image})
    const allProducts = productClass.getAll()
    /*if(allProducts.length){
      res.render("products",{allProducts})
    }else{
      res.render("productsEmpty")
    }*/
    res.json(allProducts)
  }else{
    res.json({"error":"No tienes permiso de administrador"})
  }
})

//Get one item from the routerProducts
routerProducts.get("/:id?",async(req,res)=>{
  const id = req.params.id
  if(id){
    const product = await productClass.getById(parseInt(id))
    if(!product){
      res.json({error:'producto no encontrado'})
    }
    res.json(product)
  }else{
    const allProducts = await productClass.getAll()
    /*if(allProducts.length){
      res.render("products",{allProducts})
    }else{
      res.render("productsEmpty")
    }*/
    res.json(allProducts)
  }
})




routerCart.post("/",async(req,res)=>{
  let id = await cartClass.createCart()
  res.json(id)
})

routerCart.delete("/:id",async(req,res)=>{
  await cartClass.deleteCart(parseInt(req.params.id))
  res.json(await cartClass.getCart())
})

routerCart.get("/:id/productos",async(req,res)=>{
  res.json(await cartClass.getCart())
})

routerCart.post("/:id/productos/:id_prod",async(req,res)=>{
  let id_prod = req.params.id_prod
  let id_cart = req.params.id
  let product = await productClass.getById(parseInt(id_prod))
  await cartClass.saveProduct(id_cart,product)
  res.json(await cartClass.getCart())
})

routerCart.delete("/:id/productos/:id_prod",async(req,res)=>{
  let id_prod = req.params.id_prod
  let id_cart = req.params.id
  await cartClass.deleteById(id_cart, id_prod)
  res.json(await cartClass.getCart())
})


//Define the path of the router
app.use("/api/productos", routerProducts)
app.use("/api/carrito",routerCart)