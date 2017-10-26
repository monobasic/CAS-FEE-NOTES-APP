const Datastore = require('nedb');
const db = new Datastore({ filename: './data/notes.db', autoload: true });

function Note(title, due, created, description, priority, finished, finishedOn) {
  this.title=  title;
  this.due = due;
  this.created = created;
  this.description = description;
  this.priority = priority;
  this.priority = finished;
  this.finishedOn =  finishedOn;
}

function getAll(callback) {
  console.log('store getAll');
  db.find({}, function (err, notes) {
    console.log('result:', notes);
    callback(err, notes);
  });
}


function add(title, due, created, description, priority, finished, finishedOn, callback) {
  console.log('store add');
    let note = new Note(title, due, created, description, priority, finished, finishedOn);

    db.insert(note, function(err, newDoc){
        if (callback) {
          callback(err, newDoc);
        }
    });
}
//
// function remove(id, callback) {
//     db.update({_id: id}, {$set: {"state": "DELETED"}}, {returnUpdatedDocs:true}, function (err, numDocs, doc) {
//         callback(err, doc);
//     });
// }
//
// function get(id, callback)
// {   db.findOne({ _id: id }, function (err, doc) {
//         callback( err, doc);
//     });
// }



module.exports = {getAll : getAll, add: add};
