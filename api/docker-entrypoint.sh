#!/bin/sh
set -e

echo "TROLOLOLOLOLO"

# Wait for Postgres to be ready
until PGPASSWORD=$DB_PASSWORD pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
  echo "Waiting for database..."
  sleep 2
done

# Run migrations and seeds
php artisan migrate --force
php artisan db:seed --force

# Finally, run the server
exec php artisan serve --host=0.0.0.0 --port=8000