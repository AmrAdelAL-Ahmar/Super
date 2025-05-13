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