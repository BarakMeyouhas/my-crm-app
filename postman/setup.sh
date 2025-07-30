#!/bin/bash

# CRM App Postman CLI Setup Script
# This script sets up Newman and runs initial tests

echo "🚀 Setting up Postman CLI (Newman) for CRM App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install Newman globally
echo "📦 Installing Newman (Postman CLI)..."
npm install -g newman

# Install Newman HTML reporter
echo "📦 Installing Newman HTML reporter..."
npm install -g newman-reporter-html

# Install local dependencies
echo "📦 Installing local dependencies..."
npm install

echo "✅ Newman setup complete!"

# Check if backend server is running
echo "🔍 Checking if backend server is running..."
if curl -s http://localhost:5000 > /dev/null; then
    echo "✅ Backend server is running on http://localhost:5000"
else
    echo "⚠️  Backend server is not running on http://localhost:5000"
    echo "   Please start your backend server with: cd backend && npm run dev"
    echo "   Then run this script again."
    exit 1
fi

# Run initial test
echo "🧪 Running initial test..."
npm test

echo ""
echo "🎉 Setup complete! You can now use the following commands:"
echo ""
echo "  npm test                    # Run all tests"
echo "  npm run test:auth          # Run authentication tests"
echo "  npm run test:companies     # Run company tests"
echo "  npm run test:clients       # Run client tests"
echo "  npm run test:service-requests # Run service request tests"
echo "  npm run test:admin         # Run admin tests"
echo "  npm run test:verbose       # Run with verbose output"
echo "  npm run generate:html      # Generate HTML report"
echo ""
echo "📚 For more information, see README.md" 