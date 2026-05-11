Ecommerce CRUD Application

Project Overview

This project is a full-stack Ecommerce CRUD application built using the MERN stack.

The application supports two roles:
Admin
User (Consumer)

The system allows admins to manage products and users while consumers can browse products and manage their cart.
Tech Stack

Frontend
React.js
React Router DOM
Tailwind CSS
Context API
Axios
React Hot Toast
Lucide React Icons

Backend
Node.js
Express.js

MongoDB
Mongoose

JWT Authentication
bcryptjs

Testing
Jest
Supertest

Features
Authentication
User Registration
User Login

JWT Authentication
Protected Routes
Role-Based Authorization
Admin Route Protection
Admin Features

Admins can:
Create Products
View All Products
Update Products
Delete Products
View Registered Users
User Features

Users can:
View Products
Add Products to Cart
Remove Products from Cart
Persistent Cart using LocalStorage

Product Features
Each product contains:
Category
Brand
Product Name
Description
Price
Discount
Sizes
Reviews
Stock
Product Image

Advanced Features
Product Search and Pagination
Implemented advanced product search and pagination using:

Mongoose Pagination Plugin

AI Product Assistant
Implemented an AI-style product assistant modal where users can:
Ask questions about products
Receive dynamic product-related responses

Backend API:
POST /api/ai/generate-description

Security Features

JWT Token Authentication
Password Hashing using bcrypt
Admin Authorization Middleware
Protected Backend Routes
Protected Frontend Routes

Backend .env
Environment
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
API=your_key
