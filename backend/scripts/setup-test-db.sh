#!/bin/bash

echo "Setting up test database..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5433 -U postgres; then
    echo "❌ PostgreSQL is not running on localhost:5433"
    echo "Please start PostgreSQL first:"
    echo "docker-compose up -d postgres"
    exit 1
fi

# Create test database if it doesn't exist
psql -h localhost -p 5433 -U postgres -d servix_db -c "CREATE DATABASE servix_db_test;" 2>/dev/null || echo "Database servix_db_test already exists"

# Run Prisma migrations on test database
echo "Running Prisma migrations on test database..."
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/servix_db_test" npx prisma migrate deploy

echo "✅ Test database setup complete!"
echo "You can now run: npm test" 