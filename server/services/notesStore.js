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
  let note = new Note(title, due, created, description, priority, finished, finishedOn);
  db.insert(note, function(err, newNote){
    if (callback) {
      callback(err, newNote);
    }
  });
}

function remove(id, callback) {
  db.remove({ _id: id }, {}, function (err, numRemoved) {
    if (callback) {
      callback(err, numRemoved);
    }
  });
}

function update(id, title, due, created, description, priority, finished, finishedOn, callback) {
  db.update({ _id: id }, new Note(title, due, created, description, priority, finished, finishedOn), {}, function (err, numUpdated) {
    if (callback) {
      callback(err, numUpdated);
    }
  });
}

module.exports = {getAll: getAll, get: get, add: add, remove: remove, update: update};
