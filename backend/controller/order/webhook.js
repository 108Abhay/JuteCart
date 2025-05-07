const crypto = require('crypto');
const orderModel = require('../../models/orderProductModel');
const addToCartModel = require('../../models/cartProduct');
const productModel = require('../../models/productModel');
const razorpay = require('../../config/razorpay');
const mongoose = require('mongoose');

const webhooks = async (request, response) => {
    try {
        console.log('Webhook received:', request.body.event);
        console.log('Webhook body:', JSON.stringify(request.body, null, 2));
        
        const razorpaySignature = request.headers['x-razorpay-signature'];
        const razorpayOrderId = request.body.payload.payment.entity.order_id;
        const razorpayPaymentId = request.body.payload.payment.entity.id;
        const razorpayAmount = request.body.payload.payment.entity.amount;

        console.log('Order ID:', razorpayOrderId);
        console.log('Payment ID:', razorpayPaymentId);
        console.log('Amount:', razorpayAmount);

        // Check MongoDB connection
        console.log('MongoDB connection state:', mongoose.connection.readyState);
        if (mongoose.connection.readyState !== 1) {
            throw new Error('MongoDB connection is not ready');
        }

        // Verify webhook signature
        const body = JSON.stringify(request.body);
        const webhookSecret = 'harekrishna108'; // Hardcoded for testing
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        console.log('Webhook secret used:', webhookSecret);
        console.log('Received signature:', razorpaySignature);
        console.log('Expected signature:', expectedSignature);
        console.log('Body used for signature:', body);

        if (razorpaySignature !== expectedSignature) {
            console.error('Invalid signature');
            console.error('Signature mismatch:');
            console.error('Expected:', expectedSignature);
            console.error('Received:', razorpaySignature);
            return response.status(400).json({ error: 'Invalid signature' });
        }

        // Handle payment success
        if (request.body.event === 'payment.captured') {
            console.log('Payment captured, processing order...');
            
            let orderDetails;
            
            // Check if this is a test order
            if (request.body.payload.order && request.body.payload.order.entity.notes) {
                // Use the order details from the webhook payload for test orders
                const notes = request.body.payload.order.entity.notes;
                console.log('Order notes:', notes);
                
                try {
                    const productDetails = Array.isArray(notes.productDetails) ? notes.productDetails : JSON.parse(notes.productDetails);
                    console.log('Product details:', productDetails);
                    
                    orderDetails = {
                        orderId: razorpayOrderId,
                        productDetails: productDetails,
                        email: notes.email,
                        userId: notes.userId,
                        paymentDetails: {
                            paymentId: razorpayPaymentId,
                            payment_method_type: ['razorpay'],
                            payment_status: 'completed'
                        },
                        totalAmount: razorpayAmount / 100 // Convert from paise to rupees
                    };
    } catch (err) {
                    console.error('Error parsing product details:', err);
                    throw new Error('Invalid product details format');
                }
            } else {
                // Get the order details from Razorpay for real orders
                const order = await razorpay.orders.fetch(razorpayOrderId);
                console.log('Order details from Razorpay:', order);
                
                try {
                    const productDetails = Array.isArray(order.notes.productDetails) ? order.notes.productDetails : JSON.parse(order.notes.productDetails || '[]');
                    console.log('Product details:', productDetails);

                    orderDetails = {
                        orderId: razorpayOrderId,
                productDetails: productDetails,
                        email: order.notes.email || '',
                        userId: order.notes.userId || '',
                paymentDetails: {
                            paymentId: razorpayPaymentId,
                            payment_method_type: ['razorpay'],
                            payment_status: 'completed'
                        },
                        totalAmount: razorpayAmount / 100 // Convert from paise to rupees
                    };
                } catch (err) {
                    console.error('Error parsing product details:', err);
                    throw new Error('Invalid product details format');
                }
            }

            console.log('Creating order with details:', JSON.stringify(orderDetails, null, 2));

            try {
                // Validate order details against schema
                const validationError = new orderModel(orderDetails).validateSync();
                if (validationError) {
                    console.error('Order validation error:', validationError);
                    throw new Error('Order validation failed');
            }

                const newOrder = new orderModel(orderDetails);
                console.log('New order model created:', newOrder);

                const saveOrder = await newOrder.save();
                console.log('Order saved:', saveOrder);

            if (saveOrder?._id) {
                    await addToCartModel.deleteMany({ userId: orderDetails.userId });
                    console.log('Cart cleared for user:', orderDetails.userId);
                }

                return response.status(200).json({ success: true });
            } catch (err) {
                console.error('Error saving order:', err);
                throw new Error(`Failed to save order: ${err.message}`);
            }
        }

        response.status(200).json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        console.error('Full error details:', error.stack);
        response.status(500).json({ error: 'Webhook processing failed', details: error.message });
    }
};

module.exports = webhooks;
