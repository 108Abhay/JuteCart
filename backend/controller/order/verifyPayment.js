const crypto = require('crypto');
const orderModel = require('../../models/orderProductModel');
const addToCartModel = require('../../models/cartProduct');
const razorpay = require('../../config/razorpay');

const verifyPayment = async (request, response) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = request.body;

        console.log('Verifying payment with:', {
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            signature: razorpay_signature
        });

        // Get order details from Razorpay first
        const order = await razorpay.orders.fetch(razorpay_order_id);
        console.log('Order details from Razorpay:', order);

        // Verify signature using Razorpay's method
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', '6xEKCDY2pHaTJNSdtB3yfCiu') // Using the key secret directly for testing
            .update(body)
            .digest('hex');

        console.log('Generated signature:', expectedSignature);
        console.log('Received signature:', razorpay_signature);

        if (expectedSignature !== razorpay_signature) {
            console.error('Signature mismatch');
            return response.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
        }
        
        // Create order in database
        const orderDetails = {
            orderId: razorpay_order_id,
            productDetails: JSON.parse(order.notes.productDetails),
            email: order.notes.email,
            userId: order.notes.userId,
            paymentDetails: {
                paymentId: razorpay_payment_id,
                payment_method_type: ['razorpay'],
                payment_status: 'completed'
            },
            totalAmount: order.amount / 100
        };

        console.log('Creating order with details:', orderDetails);

        const newOrder = new orderModel(orderDetails);
        await newOrder.save();

        // Clear cart
        await addToCartModel.deleteMany({ userId: order.notes.userId });

        response.status(200).json({
            success: true,
            message: 'Payment verified successfully'
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        response.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = verifyPayment; 