const crypto = require('crypto');
const axios = require('axios');

// Test data
const webhookSecret = 'harekrishna108';
const testOrderId = 'order_test_' + Date.now();
const testPaymentId = 'pay_test_' + Date.now();

// Create test webhook payload
const webhookPayload = {
    event: 'payment.captured',
    payload: {
        payment: {
            entity: {
                id: testPaymentId,
                order_id: testOrderId,
                amount: 10000, // ₹100.00
                currency: 'INR',
                status: 'captured'
            }
        },
        order: {
            entity: {
                id: testOrderId,
                notes: {
                    productDetails: JSON.stringify([
                        {
                            productId: 'test_product_1',
                            quantity: 1,
                            price: 10000
                        }
                    ]),
                    email: 'test@example.com',
                    userId: 'test_user_1'
                }
            }
        }
    }
};

// Create webhook signature
const body = JSON.stringify(webhookPayload);
const signature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

// Send webhook to local server
async function testWebhook() {
    try {
        console.log('Sending test webhook...');
        console.log('Payload:', JSON.stringify(webhookPayload, null, 2));
        console.log('Signature:', signature);

        const response = await axios.post('http://localhost:8000/api/webhook', webhookPayload, {
            headers: {
                'Content-Type': 'application/json',
                'x-razorpay-signature': signature
            }
        });

        console.log('Webhook response:', response.data);
    } catch (error) {
        console.error('Error sending webhook:', error.response?.data || error.message);
    }
}

// Run the test
testWebhook(); 