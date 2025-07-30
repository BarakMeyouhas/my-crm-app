#!/bin/bash

echo "Setting up local PostgreSQL for testing..."

# Check if PostgreSQL is running locally
if ! pg_isready -h localhost -p 5433 -U postgres; then
    echo "❌ PostgreSQL is not running on localhost:5432"
    echo "Please install and start PostgreSQL:"
    echo ""
    echo "Windows:"
    echo "1. Download from https://www.postgresql.org/download/windows/"
    echo "2. Install with default settings"
    echo "3. Start PostgreSQL service"
    echo ""
    echo "macOS:"
    echo "brew install postgresql"
    echo "brew services start postgresql"
    echo ""
    echo "Linux (Ubuntu/Debian):"
    echo "sudo apt-get install postgresql postgresql-contrib"
    echo "sudo systemctl start postgresql"
    echo ""
    exit 1
fi

# Create test database if it doesn't exist
echo "Creating test database..."
psql -h localhost -p 5433 -U postgres -d postgres -c "CREATE DATABASE servix_db_test;" 2>/dev/null || echo "Database servix_db_test already exists"

# Run Prisma migrations on test database
echo "Running Prisma migrations on test database..."
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/servix_db_test" npx prisma migrate deploy

echo "✅ Local PostgreSQL test database setup complete!"
echo "You can now run: npm run test:local" 