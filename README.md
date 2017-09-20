# CAS-FEE-NOTES-APP

## Installation for development

### Clone repository
```
$ git clone --recursive git@github.com:monobasic/CAS-FEE-NOTES-APP.git
```
This will clone all sources


### Install node modules for gulp and dependencies

```
$ npm install
```

## Setup Gulp Configuration
Checkout gulpfile.js and tweak the config parameters there.

### Gulp Default Task
```
$ gulp
```
This will start a local on-demand server with BrowserSync. The SASS/JS/MUSTACHE Template files will be watched for changes and CSS/JS will be re-generated on save. The /dist folder will be served by default.


### Deployment via rsync
There is a nice deployment task too - checkout the config object inside gulpfile.js and setup your server settings. For every deployment target (_dev_, _prod_, ...), you have to define a couple of things in the global `env` variable.

```
var env = {
  dev: {
    user: 'andre',
    host: 'dev.andre-abt.com',
    // this path MUST end with a trailing slash
    path: '/home/andre-abt/www/dev.andre-abt.com/myproject/',
  },
};
```

Your environment name can be anything you want, but generally you should stick to the _well known_ ones (dev, stage, prod). For every environment defined this way, you'll get a couple of tasks that should help with deployment.

```bash
# deploy code to target MYENV
$ gulp deploy:MYENV
```

## Instructions for the App
...
