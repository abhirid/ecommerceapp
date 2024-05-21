import mongoose from "mongoose";

export const connectDB= async ()=>{
    await mongoose.connect('mongodb+srv://abhirid:Abhishek@cluster0.jwjpf6o.mongodb.net/foodDelivery').then(()=>{
        console.log("DB Connected")
    }).catch((err)=>{
        console.log(err)
    })
}