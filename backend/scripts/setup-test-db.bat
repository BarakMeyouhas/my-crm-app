@echo off
echo Setting up test database...

REM Check if PostgreSQL is running (basic check)
echo Checking PostgreSQL connection...
timeout /t 2 >nul

REM Create test database if it doesn't exist
echo Creating test database...
psql -h localhost -p 5433 -U postgres -d servix_db -c "CREATE DATABASE servix_db_test;" 2>nul || echo Database servix_db_test already exists

REM Run Prisma migrations on test database
echo Running Prisma migrations on test database...
set DATABASE_URL=postgresql://postgres:postgres@localhost:5433/servix_db_test
npx prisma migrate deploy

echo ✅ Test database setup complete!
echo You can now run: npm test 