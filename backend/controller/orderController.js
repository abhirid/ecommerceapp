import orderModel from "../models/orderModel.js";
import { userModel } from "../models/userModel.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing order
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            // Changed property name from "amout" to "amount" to correct the typo
            amount: req.body.amount, // Correct typo from amout to amount
            // Converted items array to string using JSON.stringify
            items: JSON.stringify(req.body.items), // Convert items array to string
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100 * 82
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Delivery Charges',
                },
                unit_amount: 2 * 100 * 82
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Error creating" });
    }

}
const verifyOrder=async (req, res) => {
    const{orderId,success}=req.body;
    console.log(orderId,success)
    try{
if(success=="true"){
    await orderModel.findByIdAndUpdate(orderId,{payment:true});
    res.json({success:true,message:'Paid'})
}else{
    await orderModel.findByIdAndDelete(orderId);
    res.json({success:false,message:'Not Paid'})
}
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"error"})

    }
}
//user orders for frontend
const userOrders=async(req,res)=>{
    try{
        const orders=await orderModel.find({userId:req.body.userId})
        console.log(orders)
        res.json({success:true,data:orders})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:"error"})
    }
}
//listing orders for admin panel

const listOrders = async(req,res)=>{
    try{
        const orders=await orderModel.find()
        console.log(orders)
        res.json({success:true,data:orders})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:"error"})
    }
}
// api for updating order status
const updateOrderStatus =async(req,res)=>{
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status updated"})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:"error"})
    }

}
export { placeOrder ,verifyOrder,userOrders,listOrders,updateOrderStatus};
