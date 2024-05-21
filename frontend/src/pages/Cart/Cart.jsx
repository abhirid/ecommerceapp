import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
function Cart() {
  const {cartItems,food_list,removeFromCart,getTotalCartItems,url} = useContext(StoreContext)
  //console.log(food_list,cartItems)
  const navigate=useNavigate();
  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item,index)=>{
          if(cartItems[item._id]>0){
            return (
             <div>
               <div className="cart-items-title cart-items-item" key={index}>
                <img src={url+"/images/"+item.image} alt="" />
                <p>{item.name}</p>
                <p>${item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>${item.price*cartItems[item._id]}</p>
                <p className='cross' onClick={()=>removeFromCart(item._id)}>X</p>
              </div>
              <hr />
             </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartItems()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartItems()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${getTotalCartItems()===0?0:getTotalCartItems()+2}</p>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>Proceed To Checkout</button>

        </div>
      </div>
      
    </div>
  )
}

export default Cart
