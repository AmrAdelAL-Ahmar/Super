# Supermarket Delivery Application - Backend Server

This is the backend server for the Supermarket Delivery Application, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication and authorization
- Product management
- Order processing
- Cart management
- Payment integration
- Store management
- Review system
- Notification system
- Address management
- Category management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd supermarket-app/server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and configure your environment variables:
```bash
cp src/config/.env.example .env
```

4. Update the `.env` file with your configuration values.

## Development

1. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000` by default.

## Production Build

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## API Documentation

The API documentation is available at `/api/v1/docs` when the server is running.

### API Endpoints

- Authentication: `/api/v1/auth/*`
- Users: `/api/v1/users/*`
- Products: `/api/v1/products/*`
- Orders: `/api/v1/orders/*`
- Carts: `/api/v1/carts/*`
- Payments: `/api/v1/payments/*`
- Stores: `/api/v1/stores/*`
- Reviews: `/api/v1/reviews/*`
- Categories: `/api/v1/categories/*`
- Addresses: `/api/v1/addresses/*`
- Notifications: `/api/v1/notifications/*`

## Project Structure

```
server/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── interfaces/     # TypeScript interfaces
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── validators/     # Request validators
│   └── index.ts        # Application entry point
├── tests/              # Test files
├── logs/               # Log files
├── .env.example        # Environment variables example
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Linting

Run the linter:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 