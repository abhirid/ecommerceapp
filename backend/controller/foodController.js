import foodModel from "../models/foodModel.js";
import fs from 'fs'



// add food item
const addFood=async (req,res)=>{
    let image_filename = req.file.filename;
    const food=new foodModel({
        name:req.body.name,
        price:req.body.price,
        description:req.body.description,
        category:req.body.category,
        image:image_filename
    })
try {
    await food.save();
    res.status(200).json({
        success:true,
        message:"Food added successfully"
    })
    
} catch (error) {
    res.status(500).json({success:false, message:'Error saving'})
}
}

//all food list
const listFood= async (req,res)=>{
    try {
        const foods= await foodModel.find({})
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'Error fetching'})
    }

}
//remove food item

const removeFood=async (req,res)=>{
try {
    const food=await foodModel.findById(req.body.id)
    fs.unlink(`uploads/${food.image}`,()=>{})
    await foodModel.findByIdAndDelete(req.body.id)
    res.status(200).json({
        success:true,
        message:"Food removed successfully"
    })
} catch (error) {
    console.log(error)
    res.status(500).json({success:false, message:'Error fetching'})
}
}

export {addFood,listFood,removeFood}