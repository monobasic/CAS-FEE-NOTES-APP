# CAS-FEE-NOTES-APP

## Installation for development

### Clone repository
```
$ git clone git@github.com:monobasic/CAS-FEE-NOTES-APP.git
```
The project contains both the back end and the front end part of the Application.

The back end part is located inside the "server" folder. It's a simple Node.js/Express app with NEDB persisting data into a JSON file.
It has his own NPM dependencies. For production it would make sense, to move the server part to a separated repository. So it would be very easy to deploy the back end to a Node hosting like heroku.com as example.

The front end application part, with his NPM dependencies, lives inside the repos root folder. 

The front end is based on a Gulp build process. Files from the "src" folder will be built to a "dist" folder. The "src" folder is the place for you to edit files and do implementations. This "dist" folder is the one you will see in the browser and the one you would use for deployment to a live site.

### Setup Back End/API Server
#### Install Back End NPM dependencies
The Server lives inside the "server" folder and has its own packages.json file for the dependencies.

```
$ cd server
server/$ npm install
```

#### Startup Back End
```
server/$ node index.js
```

Let the Server run, open a new Terminal and:


### Setup Front End App
#### Install Front End NPM dependencies

```
$ (Inside the repo's root folder)
$ npm install
```

#### Startup Frontend App
```
$ gulp
```
The default build and watch tasks will be run, the browser will open http://localhost:3000 automatically and the front end will connect to the already running server on: http://127.0.0.1:3001

**Congrats, you are now ready for testing/development! :)**

## More informations

### Build Configuration
Checkout gulpfile.babel.js and tweak the config parameters there. The full front end app is ES6. All javascript will be concatenated, transpiled to browser friendly ES5 including import/export statements and served as one file.

### Gulp Default Task
The default gulp task starts a local web server with live-reload across different browser||devices via BrowserSync. The SASS/JS/Template files will be watched for changes and re-generated on save. The /dist folder is served by default.
Included is a custom error notification system as well, which notifies about build errors on the console and via system notify and doesn't interrupt running gulp streams.

### Theming
The front end app has a theme option.
To add a new theme, just copy one of the included themes in /src/scss/themes/ and tweak the variables and webfonts.
Basically, a theme consists of webfonts and a styles depending on the provided variables. Themes will be included in the build automatically soon as the SASS files are there.
You need to add a new option for your theme in the style-switch select (src/templates/home.hbs).

## Tests
There is a small Jasmine test suite included. For now, only the Model Class is tested. 
Run the Jasmine tests suite with:
```
$ npm run test
```
