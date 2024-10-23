import React, {  useState,useEffect } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
const Add = () => {
    const[image,setImage]=useState(false)
    const[data,setData]=useState({
        name:'',
        description:'',
        category:'Salad',
        price:'',  
    })
    const url='http://localhost:4000'
    const onChangeHandler=(event) =>{

        const name=event.target.name;
        const value=event.target.value;
        setData(data=>({...data,[name]:value}))
    }
    const onSubmitHandler=async (e) =>{
        e.preventDefault();
       const formData=new FormData();
        formData.append('name',data.name);
        formData.append('description',data.description);
        formData.append('category',data.category);
        formData.append('price',Number(data.price));
        formData.append('image',image);
        const response=await axios.post(`${url}/api/food/addFood`,formData)
        // console.log(response)
        if(response.data.success){
            setData({
                name:'',
                description:'',
                category:'Salad',
                price:'',
            })
            setImage(false)
            toast.success(response.data.message);
        }
        else{
            toast.error(response.data.message);
        }
    }
    useEffect(() => {
        onSubmitHandler(); 
    }, [data]); 
    
  return (
    <div className='add'>
        <form className='flex-col' onSubmit={onSubmitHandler}>
            <div className="add-img-upload flex-col">
                <p>Upload Image</p>
                <label htmlFor="image">
                    <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
                </label>
                <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required />
            </div>
            <div className="add-product-name flex-col">
                <p>Product name</p>
                <input type="text" onChange={onChangeHandler} value={data.name} name='name' placeholder='Type here' required />
            </div>
            <div className="add-product-description flex-col">
                <p>Product Description</p>
                <textarea onChange={onChangeHandler} value={data.description} name='description' rows='6' placeholder='Type here' required />
            </div>
            <div className="add-category-price">
                <div className='add-category flex-col'>
                    <p>Product Category</p>
                    <select onChange={onChangeHandler} name='category' required>
                       
                        <option value="Salad">Salad</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Deserts">Deserts</option>
                        <option value="Sandwich">Sandwich</option>
                        <option value="Cake">Cake</option>
                        <option value="Pure Veg">Pure Veg</option>
                        <option value="PastaNoodles">Pasta</option>
                        <option value="Noodles">Noodles</option>
                    </select>
                </div>
                <div className="add-price flex-col">
                    <p>Product price</p>
                    <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='$20' required />
                </div>
     
                
            </div>
            <button type='submit' className='add-btn'>ADD</button>
        </form>
      
    </div>
  )
}

export default Add