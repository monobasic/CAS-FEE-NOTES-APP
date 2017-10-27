# CAS-FEE-NOTES-APP

## Installation for development

### Clone repository
```
$ git clone --recursive git@github.com:monobasic/CAS-FEE-NOTES-APP.git
```
This will clone all sources


### Install npm package dependencies for Frontend App

```
$ npm install
```

### Install npm package dependencies for Backend/API

```
$ cd server
$ npm install
```

### Startup Backend/API Server
```
$ cd server
$ node index.js
```

### Startup Frontend App
```
$ (In project root)
$ gulp
```

## Setup Gulp Configuration
Checkout gulpfile.babel.js and tweak the config parameters there.

### Gulp Default Task
The default gulp task starts a local web server with live-reload across different browser||devices via BrowserSync. The SASS/JS/Template files will be watched for changes and re-generated on save. The /dist folder is served by default.
Included is a custom error notification system as well, which notifies about build errors on the console and via system notify and doesn't interrupt running gulp streams.

### Theming
To add a new theme, just copy one of the included themes in /src/scss/themes/ and tweak the variables and webfonts.

## Instructions for the App
...
