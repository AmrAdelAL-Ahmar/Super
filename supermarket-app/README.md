# Supermarket Delivery Application

A full-stack application for supermarket delivery services with support for English and Arabic languages. This application allows supermarket owners to manage products and employees, customers to browse and order products, and delivery employees to deliver orders.

## 📋 Features

### For Supermarket Owners
- Add and manage products
- Set prices and manage inventory
- Manage delivery employees
- Receive and process customer orders
- View delivery status and order history

### For Customers
- Browse products by category
- Search and filter products
- Add products to cart
- Place orders with delivery location
- Track order status
- Receive notifications when delivery person arrives

### For Delivery Employees
- View assigned orders
- Navigate to customer locations
- Notify customers upon arrival
- Confirm delivery completion

## 🧰 Technology Stack

### Frontend
- Next.js (React framework)
- TypeScript
- Redux Toolkit & RTK Query
- Tailwind CSS
- Material UI
- Framer Motion
- i18next for multilingual support (English/Arabic)

### Backend
- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT)
- Socket.io for real-time notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd supermarket-app
```

2. Install client dependencies
```bash
cd client
npm install
# or
yarn install
```

3. Install server dependencies
```bash
cd ../server
npm install
# or
yarn install
```

4. Set up environment variables
   - Create a `.env` file in the server directory (use `.env.example` as reference)

5. Start the development servers

For the client:
```bash
cd client
npm run dev
# or
yarn dev
```

For the server:
```bash
cd server
npm run dev
# or
yarn dev
```

## 📱 Mobile Responsiveness

The application is designed to be fully responsive, providing optimal user experience on:
- Desktop computers
- Tablets
- Mobile phones

## 🌐 Internationalization

The application supports both English and Arabic languages with appropriate RTL/LTR layout switching.

## 🔒 Authentication & Authorization

- JWT-based authentication
- Role-based access control:
  - Customer
  - Supermarket Owner
  - Delivery Employee

## 🗄️ Project Structure

```
supermarket-app/
├── client/                     # Frontend application
│   ├── public/                 # Static assets
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── features/           # Feature-based modules
│       ├── layouts/            # Layout components
│       ├── locales/            # Translation files
│       ├── pages/              # Next.js pages
│       ├── services/           # API services
│       ├── store/              # Redux store
│       ├── styles/             # Global styles
│       ├── types/              # TypeScript types
│       └── utils/              # Utility functions
│
└── server/                     # Backend application
    ├── config/                 # Configuration files
    ├── controllers/            # Request handlers
    ├── middleware/             # Custom middleware
    ├── models/                 # Database models
    ├── routes/                 # API routes
    ├── services/               # Business logic
    └── utils/                  # Utility functions
```

## 🔄 Real-time Features

- Order status updates
- Delivery notifications
- Chat between customer and delivery person
- Location tracking for delivery

## 📊 Future Enhancements

- Payment gateway integration
- Advanced analytics for supermarket owners
- Customer loyalty program
- Product reviews and ratings
- Expanded language support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 

## User Management System

The Supermarket App includes a comprehensive user management system with the following features:

### Authentication Features
- User registration and login
- Password recovery
- JWT-based authentication
- Role-based authorization (customer, owner, delivery)
- Secure password storage with bcrypt hashing

### Profile Management
- Update personal information
- Change password
- Manage address book

### Address Management
- Add, edit, and delete delivery addresses
- Set default address
- Store coordinates for map integration

## Setup Instructions

### Quick Setup

#### Using the Setup Script (Linux/Mac):
```bash
# Navigate to the project directory
cd supermarket-app

# Make the setup script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

#### Using the Setup Batch File (Windows):
```bash
# Navigate to the project directory
cd supermarket-app

# Run the setup batch file
setup.bat
```

### Manual Setup

1. Set up the server:
   ```bash
   # Navigate to the server directory
   cd supermarket-app/server
   
   # Create a .env file with the following content:
   # NODE_ENV=development
   # PORT=5000
   # MONGO_URI=mongodb://localhost:27017/supermarket
   # JWT_SECRET=your_secret_key
   # JWT_EXPIRE=30d
   # JWT_COOKIE_EXPIRE=30
   # CLIENT_URL=http://localhost:3000
   
   # Install dependencies
   npm install
   
   # Build TypeScript
   npm run build
   
   # Start the development server
   npm run dev
   ```

2. Set up the client:
   ```bash
   # Navigate to the client directory
   cd supermarket-app/client
   
   # Create a .env.local file with the following content:
   # NEXT_PUBLIC_API_URL=http://localhost:5000/api
   
   # Install dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```

### Testing the User Management System

1. Register a new account at http://localhost:3000/register
2. Log in with your credentials at http://localhost:3000/login
3. Access your profile at http://localhost:3000/profile to update personal information
4. Manage your addresses at http://localhost:3000/profile/addresses

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/logout` - Logout and clear cookie
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

#### Address Management
- `POST /api/users/addresses` - Add a new address
- `PUT /api/users/addresses/:id` - Update an address
- `DELETE /api/users/addresses/:id` - Delete an address

#### User Management (Owner Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user 