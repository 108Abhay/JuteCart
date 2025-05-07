const razorpay = require('../../config/razorpay')
const userModel = require('../../models/userModel')

const paymentController = async(request, response) => {
    try {
        const { cartItems } = request.body
        const user = await userModel.findOne({ _id: request.userId })

        // Calculate total amount
        const totalAmount = cartItems.reduce((total, item) => {
            return total + (item.productId.sellingPrice * item.quantity)
        }, 0)

        // Format product details for order
        const productDetails = cartItems.map(item => ({
            productId: item.productId._id,
            name: item.productId.productName,
            price: item.productId.sellingPrice,
            quantity: item.quantity,
            image: item.productId.productImage[0]
        }))

        // Create Razorpay order
        const options = {
            amount: totalAmount * 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: "receipt_" + Date.now(),
            notes: {
                userId: request.userId,
                email: user.email,
                productDetails: JSON.stringify(productDetails)
            }
        }

        const order = await razorpay.orders.create(options)

        response.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        })

    } catch (error) {
        response.status(500).json({
            message: error?.message || error,
            error: true,
            success: false
        })
    }
}

module.exports = paymentController
