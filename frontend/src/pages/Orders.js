import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import OrderCard from '../components/OrderCard';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await fetch(SummaryApi.getOrder.url, {
                method: SummaryApi.getOrder.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-2xl font-bold mb-6'>Your Orders</h1>
            
            {orders.length === 0 ? (
                <div className='text-center py-8'>
                    <p className='text-gray-600'>No orders found</p>
                </div>
            ) : (
                <div className='space-y-6'>
                    {orders.map((order) => (
                        <OrderCard key={order._id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders; 