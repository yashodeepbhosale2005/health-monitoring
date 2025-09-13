@echo off
echo Starting Health Monitoring Smart Band Application...
echo.

echo Checking if MongoDB is running...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB is not installed or not in PATH
    echo Please install MongoDB and try again
    pause
    exit /b 1
)

echo Starting MongoDB...
start "MongoDB" mongod

echo Waiting for MongoDB to start...
timeout /t 5 /nobreak >nul

echo Installing dependencies...
call npm run install-all

echo Starting the application...
call npm run dev

pause
