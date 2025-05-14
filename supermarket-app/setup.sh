#!/bin/bash

# Supermarket App Setup Script

echo "===== Setting up Supermarket App ====="

# Set up environment variables file
if [ ! -f "./server/.env" ]; then
  echo "Creating .env file for server..."
  cat > ./server/.env << EOL
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/supermarket
JWT_SECRET=supermarket_app_secret_key_development_123456
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CLIENT_URL=http://localhost:3000
EOL
  echo ".env file created for server."
fi

if [ ! -f "./client/.env.local" ]; then
  echo "Creating .env.local file for client..."
  cat > ./client/.env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOL
  echo ".env.local file created for client."
fi

# Install server dependencies
echo "Installing server dependencies..."
cd server && npm install
echo "Building TypeScript server..."
npm run build

# Install client dependencies
echo "Installing client dependencies..."
cd ../client && npm install

echo "===== Setup Complete ====="
echo ""
echo "To start the server: cd server && npm run dev"
echo "To start the client: cd client && npm run dev"
echo ""
echo "For production:"
echo "Server: cd server && npm run build && npm start"
echo "Client: cd client && npm run build && npm start" 