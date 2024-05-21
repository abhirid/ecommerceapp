
import { userModel } from "../models/userModel.js";



const addToCart = async (req, res) => {
    try {
        const userId = req.body.userId;
      let userData = await userModel.findOne({ _id: userId });

       
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Initialize cartData if it's undefined
        let cartData = userData.cartData || {};

        console.log("Cart Data:", cartData); // Log the cartData to see if it's being retrieved correctly

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        // Update the user document
        await userModel.findByIdAndUpdate(userId, { cartData: cartData });

        res.status(200).json({
            success: true,
            message: "Item added to cart"
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Error adding to cart"
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.body.userId;
      

        // Find the user by userId
        let userData = await userModel.findById({ _id: userId });

        // Check if userData is null or undefined
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData ;

        // Check if the item exists in the cart
        if (cartData[req.body.itemId] && cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1; // Decrease the quantity by 1
        } else {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        // Update the user document
        await userModel.findByIdAndUpdate(userId, { cartData: cartData });
console.log(cartData)
        res.status(200).json({
            success: true,
            message: "Item removed from cart"
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Error removing from cart"
        });
    }
};


const getCart = async (req, res) => {
  try{
    const userId = req.body.userId;
    let userData=await userModel.findById(userId)
    let cartData=await userData.cartData;
    res.json({success:true,cartData})

  }catch(error){
    console.log(error.message)
    res.json({success:false,message:'error'})
  } 
};

export { addToCart, removeFromCart, getCart };
