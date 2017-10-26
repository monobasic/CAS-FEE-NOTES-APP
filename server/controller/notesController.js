const store = require("../services/notesStore.js");

module.exports.getNotes = function(req, res) {
  console.log('controller: getNotes');
  store.getAll(function(err, notes) {

  });
};

module.exports.createNote = function(req, res) {
  console.log('controller: createNote');

  store.add(req.body.title, req.body.due, req.body.created, req.body.description, req.body.priority, req.body.finished, req.body.finishedOn, function(err, order) {
    console.log('callback from controller, note added!');
  });
};

// module.exports.getNote = function(req, res) {
//   store.get(req.params.id, function(err, order) {
//   });
// };
//
// module.exports.deleteNote =  function (req, res) {
//   store.delete(  req.params.id , function(err, order) {
//
//   });
// };
