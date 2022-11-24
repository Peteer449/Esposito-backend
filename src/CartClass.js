const ProductsClass = require("./ProductsClass")
const productClass = new ProductsClass()
let cart = []
let cartId = 1
let productId = 1

class Cart{
  createCart(){
    cart.push({cartId})
    id++
  }
  deleteCart(){
    cart = []
  }
  saveProduct(id){
    let product = productClass.getById(id)
    cart.push({product,productId})
  }
  getAllProducts(){
    return cart
  }
  deleteById(id){
    const itemToDelete=cart.find(e=>e.id===id)
    const index = cart.indexOf(itemToDelete)
    cart.splice(index,1)
  }
}

module.exports = Cart