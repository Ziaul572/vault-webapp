#!/bin/sh
set -ex

# Move to application directory
cd /app

# Run any new database migrations
python ./manage.py migrate

# Load test fixture data only on initial run
if [ ! -f storage/firstrun ]; then
    python ./manage.py loaddata --all
    touch storage/firstrun
fi

# Create Admin User, ignore errors if it already exists
python ./manage.py createsuperuser --noinput || true

# Run Django’s development server
python ./manage.py runserver 0.0.0.0:8000