import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)

    const fetchData = async() => {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
        })

        const responseData = await response.json()

        if(responseData.success) {
            setData(responseData.data)
        }
    }

    const handleLoading = async() => {
        await fetchData()
    }

    useEffect(() => {
        setLoading(true)
        handleLoading()
        setLoading(false)
    }, [])

    const increaseQty = async(id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                _id: id,
                quantity: qty + 1
            })
        })

        const responseData = await response.json()

        if(responseData.success) {
            fetchData()
        }
    }

    const decraseQty = async(id, qty) => {
        if(qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({
                    _id: id,
                    quantity: qty - 1
                })
            })

            const responseData = await response.json()

            if(responseData.success) {
                fetchData()
            }
        }
    }

    const deleteCartProduct = async(id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                _id: id,
            })
        })

        const responseData = await response.json()

        if(responseData.success) {
            fetchData()
            context.fetchUserAddToCart()
        }
    }

    const handlePayment = async() => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.payment.url, {
                method: SummaryApi.payment.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({
                    cartItems: data
                })
            })

            const responseData = await response.json()

            if(responseData.success) {
                const options = {
                    key: responseData.key,
                    amount: responseData.amount,
                    currency: responseData.currency,
                    order_id: responseData.orderId,
                    name: "Your Store Name",
                    description: "Payment for your order",
                    notes: {
                        productDetails: JSON.stringify(data.map(item => ({
                            productId: item.productId._id,
                            quantity: item.quantity,
                            price: item.productId.sellingPrice
                        }))),
                        email: context?.user?.email || '',
                        userId: context?.user?._id || ''
                    },
                    handler: async function (response) {
                        try {
                            console.log('Payment response:', response);
                            
                            const verifyResponse = await fetch(SummaryApi.verifyPayment.url, {
                                method: SummaryApi.verifyPayment.method,
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });

                            const verifyData = await verifyResponse.json();
                            console.log('Verification response:', verifyData);
                            
                            if(verifyData.success) {
                                window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/success`;
                            } else {
                                alert('Payment verification failed: ' + (verifyData.message || 'Unknown error'));
                            }
                        } catch (err) {
                            console.error('Payment verification error:', err);
                            alert('Payment verification failed. Please contact support.');
                        }
                    },
                    prefill: {
                        name: context?.user?.name || "Customer Name",
                        email: context?.user?.email || "customer@example.com",
                        contact: context?.user?.phone || "9999999999"
                    },
                    theme: {
                        color: "#3399cc"
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                alert('Failed to create order: ' + (responseData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert('Failed to initiate payment. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)
    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0)

    return (
        <div className='container mx-auto'>
            <div className='text-center text-lg my-3'>
                {
                    data.length === 0 && !loading && (
                        <p className='bg-white py-5'>No Data</p>
                    )
                }
            </div>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
                <div className='w-full max-w-3xl'>
                    {
                        loading ? (
                            loadingCart?.map((el, index) => {
                                return (
                                    <div key={el + "Add To Cart Loading" + index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>
                                    </div>
                                )
                            })
                        ) : (
                            data.map((product, index) => {
                                return (
                                    <div key={product?._id + "Add To Cart Loading"} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                                        <div className='w-32 h-32 bg-slate-200'>
                                            <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                                        </div>
                                        <div className='px-4 py-2 relative'>
                                            <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product?._id)}>
                                                <MdDelete />
                                            </div>

                                            <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                                            <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                                            <div className='flex items-center justify-between'>
                                                <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                                <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                </div>

                {
                    data[0] && (
                        <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                            {
                                loading ? (
                                    <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'>
                                    </div>
                                ) : (
                                    <div className='h-36 bg-white'>
                                        <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
                                        <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                            <p>Quantity</p>
                                            <p>{totalQty}</p>
                                        </div>

                                        <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                            <p>Total Price</p>
                                            <p>{displayINRCurrency(totalPrice)}</p>
                                        </div>

                                        <button className='bg-blue-600 p-2 text-white w-full mt-2' onClick={handlePayment}>Payment</button>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Cart