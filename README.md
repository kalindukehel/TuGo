# Tugo

## Entering virtual environment

    $ pipenv shell

## Create new model

    $ python manage.py startapp <name>

## Migrating

    $ python manage.py makemigrations <name>

    $ python manage.py migrate

## Run REST API

    $ cd tmanager

edit settings.py and add local ip to ALLOWED_HOSTS

    $ python manage.py runserver 0.0.0.0:8000

last parameter opens the server to the network

## Install dependencies

    $ yarn install

or

    $ npm install

## Run App Debugging Server

    $ cd TuGo

Edit constants.js to include local ip ex. "192.168.0.18"

    $ yarn start

or run using expo

    $ expo start

## Extend GraphQL api key

    $ go to https://console.aws.amazon.com/appsync/home?region=us-east-1#/apis

    $ select api

    $ go to settings
