import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

function Navbar({ setShowLogin }) {
    const [menu, setMenu] = useState("home");
    const { cartItems,token,setToken } = useContext(StoreContext);
    const [number, setNumber] = useState(0);
    const navigate=useNavigate();
    const getNumber = () => {
        // Calculate the total number of items in the cart
        const totalItems = Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
        setNumber(totalItems);
    };
    const logOut = () => {
        setToken('');
        localStorage.removeItem('token');
        navigate('/')
         }

    useEffect(() => {
        getNumber();
    }, [cartItems]);

    return (
        <div className='navbar'>
            <Link to='/'><img src={assets.logo} alt="" className="logo" /> </Link>
            <ul className="navbar-menu">
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
                <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
                <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile-App</a>
                <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
            </ul>
            <div className="navbar-right">
                
                <div className="navbar-search-icon">
                    <Link to='/cart'> <img src={assets.basket_icon} alt="" />  </Link>
                    <div className="dot">
                        {number}
                    </div>
                </div>
                {!token?<button onClick={() => setShowLogin(true)}>Sign In</button>
                :
                <div className='navbar-profile'>
                    <img src={assets.profile_icon} alt="" />
                      <ul className='nav-profile-dropdown'>
                        <li onClick={()=>navigate("/myorder")}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                        <hr />
                        <li onClick={logOut}><img src={assets.logout_icon} alt="" />Logout</li>
                      </ul>

                    

                </div>
                }
            </div>
        </div>
    );
}

export default Navbar;
