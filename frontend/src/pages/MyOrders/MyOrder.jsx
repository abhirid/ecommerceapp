import React, { useContext, useState, useEffect } from 'react';
import './MyOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrder = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + '/api/order/userorders', {}, { headers: { token } });
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
        getStatusColor()
    }, [token, url]);

    const getStatusColor = (status) => {
        switch (status) {
         case 'Out for delivery':
                return 'lightgreen';
            case 'Delivered':
                return 'gray';
            case 'Food Processing':
                return '#ffe1e1';
        }
    };

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    data.map((order, index) => (
                        <div key={index} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="" />
                            <p>
                                {JSON.parse(order.items).map((item, idx) => (
                                    <p key={idx}>
                                        {item.name} x {item.quantity}{idx === JSON.parse(order.items).length - 1 ? '' : ', '}
                                    </p>
                                ))}
                            </p>
                            <p>{order.amount}.00</p>
                            <p>Items: {JSON.parse(order.items).length}</p>
                            <p>
                           
                                    {order.status}
                            
                            </p>
                            <button onClick={fetchOrders} style={{ backgroundColor: getStatusColor(order.status) }}>
                                Track Order
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrder;
