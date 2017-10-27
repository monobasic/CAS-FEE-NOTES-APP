const Datastore = require('nedb');
const db = new Datastore({ filename: './data/notes.db', autoload: true });

function Note(title, due, created, description, priority, finished, finishedOn) {
  this.title=  title;
  this.due = due;
  this.created = created;
  this.description = description;
  this.priority = priority;
  this.finished = finished;
  this.finishedOn =  finishedOn;
}

function getAll(callback) {
  db.find({}, function (err, notes) {
    if (callback) {
      callback(err, notes);
    }
  });
}

function get(id, callback) {
  db.findOne({ _id: id }, function (err, note) {
    if (callback) {
      callback(err, note);
    }
  });
}

function add(title, due, created, description, priority, finished, finishedOn, callback) {
  console.log('store add');
    let note = new Note(title, due, created, description, priority, finished, finishedOn);

    db.insert(note, function(err, newNote){
        if (callback) {
          callback(err, newNote);
        }
    });
}

function remove(id, callback) {
  console.log('store remove id: ' + id);
  db.remove({ _id: id }, {}, function (err, numRemoved) {
    if (callback) {
      callback(err, numRemoved);
    }
  });
}





module.exports = {getAll: getAll, get: get, add: add, remove: remove};
