import React from 'react'
import './Orders.css'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { assets } from '../../assets/assets';
const Orders = () => {
  const [orders,setOrders]=useState([]);
  const url='http://localhost:4000'
  const fetchAllOrders = async() =>{
   const response=await axios.get(url+"/api/order/list")
   if(response.data.success){
    setOrders(response.data.data);
    console.log(response.data.data);
   }
   else{
   toast.error("Error")
   }
  }
  const statusHandler= async (event,orderId)=>{
    console.log(event.target.value,orderId)
    const response=await axios.post(url+"/api/order/status",{
      orderId:orderId,
      status:event.target.value
    })
    if(response.data.success){
      toast.success("Status Updated")
     await fetchAllOrders();
    }
  }
  useEffect(()=>{
    fetchAllOrders();
   },
[])
  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {
          orders.map((order,index)=>{
            return(
              <div className="order-item" key={index}>
                  <img src={assets.parcel_icon} alt="" />
                  <div className='order-item-food'>
                  <p className='order-item-food'>
                  {JSON.parse(order.items).map((item, idx) => (
                                    <span key={idx}>
                                      
                                        {item.name} x {item.quantity}{idx === JSON.parse(order.items).length - 1 ? '' : ', '}
                                    </span>
                                ))}
                  </p>
                  <p className='order-item-name'>
              {order.address.firstname + ' ' + order.address.lastname}
                  </p>
                  <div className="order-item-address">
                   <p>{order.address.street+", "}</p> 
                  <p>{order.address.city+", "+order.address.state+", "+order.address.country+", "+order.address.zipcode}</p>

                  </div>
                  <p className="order-item-phone">
                    {order.address.phone}
                  </p>
                  </div>
                  <p>Items : {JSON.parse(order.items).length}</p>
                  <p>${JSON.parse(order.amount)}</p>
                  <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              
             
             
              
            )
          })
        }
      </div>
      </div>
  
  )
}

export default Orders
