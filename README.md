# CAS-FEE-NOTES-APP

## Installation for development

### Clone repository
```
$ git clone --recursive git@github.com:monobasic/CAS-FEE-NOTES-APP.git
```
This will clone all sources


### Install npm package dependencies

```
$ npm install
```

## Setup Gulp Configuration
Checkout gulpfile.babel.js and tweak the config parameters there.

### Gulp Default Task
```
$ gulp
```
This will start a local web server with live-reload across different browser||devices via BrowserSync. The SASS/JS/Template files will be watched for changes and re-generated on save. The /dist folder is served by default.
Included as well is a custom error notification system, which notifies about build errors on the console and via system notify and doesn't interrupt running gulp streams.

### Theming
To add a new theme, just copy one of the included themes in /src/scss/themes/ and tweak the variables and webfonts.

## Instructions for the App
...
