# Full Stack E-Commerce Application

A complete e-commerce solution built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, product management, shopping cart, and payment integration with Razorpay.

## Features

- 🔐 User Authentication (Signup/Login)
- 🛍️ Product Management
- 🛒 Shopping Cart
- 💳 Payment Integration (Razorpay)
- 📦 Order Management
- 👤 User Profile Management
- 👨‍💼 Admin Dashboard

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Context API for State Management
- React Router for Navigation

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Razorpay Integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Razorpay Account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/108Abhay/JuteCart
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create .env files:

Backend (.env):
```
PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:3000
```

Frontend (.env):
```
REACT_APP_SERVER_DOMAIN=http://localhost:8000
```

4. Start the development servers:

```bash
# Start backend server
cd backend
npm start

# Start frontend server
cd ../frontend
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout

### Products
- GET /api/products - Get all products
- POST /api/products - Create new product (Admin)
- PUT /api/products/:id - Update product (Admin)
- DELETE /api/products/:id - Delete product (Admin)

### Cart
- GET /api/cart - Get user's cart
- POST /api/cart - Add to cart
- PUT /api/cart/:id - Update cart item
- DELETE /api/cart/:id - Remove from cart

### Orders
- GET /api/orders - Get user's orders
- POST /api/orders - Create new order
- GET /api/orders/:id - Get order details

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - abhaynarhire@gmail.com

Project Link: https://github.com/108Abhay/JuteCart
