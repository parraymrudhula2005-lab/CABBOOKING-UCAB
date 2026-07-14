@echo off
REM Simple script to test API and create data in MongoDB

echo.
echo ===== CAB-U DATABASE CREATION TEST =====
echo.
echo This script will:
echo 1. Test if backend is running
echo 2. Create a user (which creates the database)
echo 3. Show the response
echo.

REM Test if server is running
echo Testing backend connection...
curl http://localhost:5000/api/health

echo.
echo.
echo Creating user account...
echo.

REM Create a user (this creates the database!)
curl -X POST http://localhost:5000/api/users/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"testuser@example.com\",\"password\":\"password123\",\"phone\":\"9876543210\",\"role\":\"user\"}"

echo.
echo.
echo ===== DONE! =====
echo.
echo Next steps:
echo 1. Open MongoDB Compass
echo 2. Click refresh (F5)
echo 3. You should now see 'cab-u' database with 'users' collection
echo.
pause
