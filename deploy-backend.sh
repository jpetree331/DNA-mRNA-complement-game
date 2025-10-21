#!/bin/bash

# Backend deployment script for Railway
echo "Starting backend deployment..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Start the server
echo "Starting backend server..."
npm start
