import React from 'react';
import displayINRCurrency from '../helpers/displayCurrency';

const OrderCard = ({ order }) => {
    return (
        <div className='bg-white p-4 rounded shadow-md mb-4'>
            <div className='flex flex-col md:flex-row gap-4'>
                {/* Order Details */}
                <div className='flex-1'>
                    <h2 className='text-lg font-semibold mb-2'>Order #{order.orderId}</h2>
                    <p className='text-gray-600'>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className='text-gray-600'>Total Amount: {displayINRCurrency(order.totalAmount)}</p>
                    <p className='text-gray-600'>Status: <span className='text-green-600'>{order.paymentDetails.payment_status}</span></p>
                </div>

                {/* Products List */}
                <div className='flex-1'>
                    <h3 className='font-semibold mb-2'>Products</h3>
                    <div className='space-y-4'>
                        {order.productDetails.map((product, index) => (
                            <div key={index} className='flex items-center gap-4 border-b pb-2'>
                                <div className='w-20 h-20 flex-shrink-0'>
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className='w-full h-full object-contain'
                                    />
                                </div>
                                <div className='flex-1'>
                                    <h4 className='font-medium'>{product.name}</h4>
                                    <p className='text-sm text-gray-600'>Quantity: {product.quantity}</p>
                                    <p className='text-sm text-gray-600'>Price: {displayINRCurrency(product.price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCard; 