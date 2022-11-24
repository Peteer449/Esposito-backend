let cart = []
let cartId = 0

class Cart{
  getCart(){
    return cart
  }
  createCart(){
    cartId++
    cart.push({cartId,timeStamp:new Date().toLocaleTimeString()})
    return cart
  }
  deleteCart(id){
    const cartToDelete=cart.find(e=>e.cartId===id)
    const index = cart.indexOf(cartToDelete)
    if(index === -1) {return}
    cart.splice(index,1)
  }
    saveProduct (id_cart,product){
    const cartToFind=cart.find(e=>e.cartId===parseInt(id_cart))
    const index = cart.indexOf(cartToFind)
    if(index === -1) {return}
    if(!cart[index].products){
      cart[index] = {...cart[index], products:[product]}
    }else{
      cart[index].products.push(product)
    }
  }
  getAllProducts(id){
    const cartToFind=cart.find(e=>e.cartId===parseInt(id))
    const index = cart.indexOf(cartToFind)
    console.log(index)
    return cart[index]
  }
  deleteById(id_cart, id_prod){
    const cartToFind=cart.find(e=>e.cartId===parseInt( id_cart))
    const index = cart.indexOf(cartToFind)
    const productToFind = cart[index].products.find(e=>e.productId === parseInt(id_prod))
    const productIndex = cart[index].products.indexOf(productToFind)
    cart[index].products.splice(index,1)
  }
}

module.exports = Cart