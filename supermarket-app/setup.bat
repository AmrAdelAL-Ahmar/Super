@echo off
echo ===== Setting up Supermarket App =====

REM Set up environment variables file for server
if not exist ".\server\.env" (
  echo Creating .env file for server...
  echo NODE_ENV=development > .\server\.env
  echo PORT=5000 >> .\server\.env
  echo MONGO_URI=mongodb://localhost:27017/supermarket >> .\server\.env
  echo JWT_SECRET=supermarket_app_secret_key_development_123456 >> .\server\.env
  echo JWT_EXPIRE=30d >> .\server\.env
  echo JWT_COOKIE_EXPIRE=30 >> .\server\.env
  echo CLIENT_URL=http://localhost:3000 >> .\server\.env
  echo .env file created for server.
)

REM Set up environment variables file for client
if not exist ".\client\.env.local" (
  echo Creating .env.local file for client...
  echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .\client\.env.local
  echo .env.local file created for client.
)

REM Install server dependencies
echo Installing server dependencies...
cd server && npm install
echo Building TypeScript server...
npm run build

REM Install client dependencies
echo Installing client dependencies...
cd ..\client && npm install

echo ===== Setup Complete =====
echo.
echo To start the server: cd server ^&^& npm run dev
echo To start the client: cd client ^&^& npm run dev
echo.
echo For production:
echo Server: cd server ^&^& npm run build ^&^& npm start
echo Client: cd client ^&^& npm run build ^&^& npm start

REM Return to root folder
cd ..
pause 