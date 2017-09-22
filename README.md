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
This will start a local on-demand server with BrowserSync. The SASS/JS/MUSTACHE Template files will be watched for changes and CSS/JS will be re-generated on save. The /dist folder will be served by default.

### Theming
To add a new theme, just copy one of the included themes in /src/scss/themes/ and tweak the variables and webfonts.

## Instructions for the App
...
