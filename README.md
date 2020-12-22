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


## Xcode Build

Update Expo, Expo CLI, React-Native

    "expo": "^38.0.0",
    "react": "16.13.1",
    "react-dom": "16.13.1",
    "react-native": "~0.63.4",

    $ npm install

    $ cd ios

    $ pod install

    $ cd ..

    $ npx react-native run-ios --simulator="Name"
