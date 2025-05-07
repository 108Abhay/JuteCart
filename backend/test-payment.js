const axios = require('axios');
const crypto = require('crypto');
const mongoose = require('mongoose');
require('dotenv').config();

async function testPaymentFlow() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get a real product from the database
        const Product = require('./models/productModel');
        const product = await Product.findOne();
        
        if (!product) {
            throw new Error('No products found in database');
        }

        console.log('Found product:', product);

        // Step 1: Create order
        console.log('\nCreating order...');
        const orderResponse = await axios.post('http://localhost:8000/api/checkout', {
            cartItems: [{
                productId: {
                    _id: product._id.toString(),
                    productName: product.productName,
                    sellingPrice: product.sellingPrice,
                    productImage: product.productImage
                },
                quantity: 1
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE4ZDA1ODVjOTEzMDdiNTIxMGVmYzMiLCJlbWFpbCI6Im1vbmtAZ21haWwuY29tIiwiaWF0IjoxNzQ2NTkyNTAzLCJleHAiOjE3NDY2MjEzMDN9.eMHlxyCdkVNUzPmI1I0mSPvwq_KrhZ8lqoOc37nhTz0'
            }
        });

        console.log('Order created:', orderResponse.data);

        // Step 2: Simulate payment success webhook
        const productDetails = [{
            productId: product._id.toString(),
            name: product.productName,
            price: product.sellingPrice,
            quantity: 1,
            image: product.productImage[0]
        }];

        const webhookPayload = {
            event: 'payment.captured',
            payload: {
                payment: {
                    entity: {
                        id: 'pay_test123',
                        order_id: orderResponse.data.orderId,
                        amount: orderResponse.data.amount
                    }
                },
                order: {
                    entity: {
                        id: orderResponse.data.orderId,
                        amount: orderResponse.data.amount,
                        notes: {
                            userId: '6818d0585c91307b5210efc3',
                            email: 'monk@gmail.com',
                            productDetails: productDetails
                        }
                    }
                }
            }
        };

        const webhookSecret = 'harekrishna108';
        const body = JSON.stringify(webhookPayload);
        const signature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        console.log('\nSending webhook...');
        console.log('Payload:', body);
        console.log('Signature:', signature);

        const webhookResponse = await axios.post('http://localhost:8000/api/webhook', webhookPayload, {
            headers: {
                'Content-Type': 'application/json',
                'x-razorpay-signature': signature
            }
        });

        console.log('Webhook response:', webhookResponse.data);

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        console.error('Full error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testPaymentFlow(); 