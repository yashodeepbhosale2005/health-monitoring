#!/bin/bash

echo "Starting Health Monitoring Smart Band Application..."
echo

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is not installed. Please install MongoDB and try again."
    exit 1
fi

echo "Starting MongoDB..."
mongod --fork --logpath /var/log/mongodb/mongod.log

echo "Waiting for MongoDB to start..."
sleep 5

echo "Installing dependencies..."
npm run install-all

echo "Starting the application..."
npm run dev
