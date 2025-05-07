import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import OrderCard from '../components/OrderCard'

const AllOrder = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(SummaryApi.allOrder.url, {
        method: SummaryApi.allOrder.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const responseData = await response.json()
      if (responseData.success) {
        setOrders(responseData.data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderDetails()
  }, [])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return (
    <div className='p-4'>
      <div className='bg-white py-2 px-4 flex justify-between items-center mb-4'>
        <h2 className='font-bold text-lg'>All Orders</h2>
        <p className='text-gray-600'>Total Orders: {orders.length}</p>
      </div>

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
  )
}

export default AllOrder
