# EEN1037 Example Django Application

## Overview

This example website was produced by following the official Django Documentation
tutorial at <https://docs.djangoproject.com/en/5.1/intro/tutorial01/> and extending
with our example application specific models and HTML templates for a minimal Blog
system. Configuration for Visual Studio Code and Docker is also included.


## Customizing

For the assignments and group project, you will only get marks if you change
the code in this template to implement your existing Web Application application.

* Delete existing migration files in `myapp/migrations` (except `__init__.py`)
* Clear `myapp/fixtures/myapp_seeddata.json` and `myapp/fixtures/files`.

* Change all the code here to implement your web application:
  * `myapp/models.py`
  * `myapp/admin.py`
  * (Now you can test out your models in the admin UI)
  * `myapp/urls.py`
  * `myapp/views.py`
  * `myapp/templates/`
  * `myapp/static/`

(You can change the other files as you wish, but shouldn't need to).


## Developing

### Running in Visual Studio Code for the first time

* Open the project folder in Visual Studio Code
* Source Control -> Initialize Git Repository -> Commit Everything
* F1 -> Python: Create Virtual Environment -> Venv

* `Run and Debug` in this order:
  * `manage.py makemigrations`
  * `manage.py migrate`
  * `manage.py createsuperuser`
  * `manage.py runserver`


### Visual Studio Code launch targets

* Open the project folder in Visual Studio Code

* Press F5 or select `Run and Debug`
* Run the desired launch target, e.g. `manage.py runserver`

Explanation of the launch targets:

* `manage.py makemigrations`:  Generates new SQL schema changes when changes to `models.py` are detected.
* `manage.py migrate`:  Apply any pending SQL migrations.
* `manage.py createsuperuser`: Add the admin:admin user to the Django Admin UI on <http://localhost:8000/admin>.
* `manage.py runserver`: Run the development web server.
* `manage.py shell`: Access the Django Python Shell.
* `manage.py dumpdata`: Dump the current database as JSON fixture format.
* `manage.py loaddata`: Load seed data from fixtures (see settings.py:FIXTURES ).
* `manage.py cleardata`: Clears local `storage/db.sqlite3` and `storage/media/myapp_upload/*`.


### Generating new database schema migrations

After editing any Model classes in `models.py` files, you must generate
a new SQL schema migration corresponding to your changes. This can be
done automatically by running the `manage.py makemigrations` command line
tool, or in Visual Studio code by doing:

* Run and Debug:
    * `manage.py makemigrations`

These new files in `myapp/migrations` should be saved along with your source code.


### Applying database migrations to the local test database

If the schema on your database is out of date compared to your code, you
can apply the pending SQL migrations with the following:

* Run and Debug
  * `manage.py makemigrations`
  * `manage.py migrate`
  * `manage.py runserver`


### Changing database connection during development

When running in Visual Studio code, the project is configured by default to
use a local sqlite database located in `storage/db.sqlite3`.

To connect instead to the local MySQL database when running from Visual Studio Code,
uncomment the `DATABASE_URL` environment variable in `.env` file.


## Running with Docker Compose

A sample docker-compose.yml is provided which will build and run the application with a PostgreSQL database.

```
docker-compose up --build
```

You can then connect to the application at <http://localhost:8000>, and to the database at `localhost:5432` using the credentials in `docker-compose.yml`.

## Running as a Docker container

A sample Dockerfile is provided which will build and run the application.

It mounts one Docker volume on /app/storage for local file storage, and will connect
to an SQL database specified with the environment variable "DATABASE_URL".

If "DATABASE_URL" is blank, it will default to an SQLite database on the /app/storage volume.


### Building and running the Docker container

Install [Docker](https://www.docker.com/) on your system.

You can use Visual Studio Code "Docker" plugin, or the included build tasks
(Ctrl+P + "task") or these command line commands:

To build:
```
docker build . -t myapp
```

To create a persistent storage volume:
```
docker volume create myapp-storage
```

To run the container:
```
docker run -ti -v myapp-storage:/app/storage -p 8000:8000 myapp
```

To run the container and connect to the MySQL database running on the host operating system:
```
docker run -ti -v myapp-storage:/app/storage -e DATABASE_URL="mysql://myappdbuser:myappdbpass@host.docker.internal:3306/myappdb" -p 8000:8000 myapp
```

To delete the persistent volume (i.e. any stored files and test databases)
```
docker volume rm myapp-storage
```


## Test seed data

Ref:
<https://docs.djangoproject.com/en/5.1/howto/initial-data/>

You can provide example database data along with your project in 3 ways:

* Include `db.sqlite3` with your project ZIP that already includes some test
  data.

OR

* Manually create a database migration in `myapp/migrations` that includes
  some test data

OR

* (Recommended) Load example data into the database from JSON data files
  known as "fixtures".


To create fixture data, create some example entries as usual using your app
or through the Admin UI. Then use the `manage.py dumpdata` VS Code launch
target to export these database entries as JSON rows. You can then copy+paste
this into the `myapp/fixtures/myapp_seeddata.json` file, and save this with
your source code. When you run the `manage.py loaddata` VS Code launch target,
it will read this file and create entries in the database.

If you are using FileField in your models.py and want to include the user-uploaded
files with your fixture data, copy them from `storage/media/myapp_upload` into
`myapp/fixtures/files`. The included [django-smart-fixtures](https://pypi.org/project/django-smart-fixtures/)
plugin will automatically copy them back into their correct location in `storage/`.


## Exporting your project as a Zip file for assignment submission

You have 2 options:

* Simply delete your `.venv` directory then create a Zip archive of
  your project directory.

* If you are using Git for version control, you can use it to export
  your code. In Visual Studio Code, run Ctrl+P -> "Task Git Project Export" 
  to generate a ZIP file. This is the same as running the command line command:
    `git archive --format=zip --output project-export.zip HEAD`.
  Note by default `git archive` does not include your `db.sqlite3`
  database file. If you want to include that in the export to provide us
  some example data, you'll have to remove `db.sqlite3` from `.gitignore`.
