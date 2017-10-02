// Classes (separate to modules later..
class NoteModel {

  constructor() {
    this.notes = this.notes = [
      {
        "title": "CAS FEE Selbststudium / Projekt Aufgabe erledigen",
        "due": "",
        "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
        "priority": 2,
        "finished": false
      },
      {
        "title": "Einkaufen",
        "due": "",
        "description": "Consectetur adipisicing elit. Corporis doloribus earum enim, excepturi ipsa, itaque minima repellat saepe similique sint suscipit tempore totam. Accusantium error eveniet, maxime nemo quod unde.",
        "priority": 2,
        "finished": false
      },
      {
        "title": "Mom anrufen",
        "due": "",
        "description": "Tel. 041 111 22 33",
        "priority": 2,
        "finished": false
      }
    ];
    this.updateLocalStorage(this.notes);
  }

  getNotes() {
    return this.notes;
  }

  getNote(index) {

  }

  addNote(note) {
    console.log('Model: add note');
    this.notes.push(note);
  }

  deleteNote(index) {
    this.notes.splice(index, 1);
  }

  updateLocalStorage(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

}
class NoteView {

  constructor() {

  }
}
class NoteController {

  constructor(noteView, noteModel) {
    this.noteView = noteView;
    this.noteModel = noteModel;
    this.attachListeners();
  }

  attachListeners() {
    // Add new note Listener
    document.querySelectorAll('.js-note-add').forEach((element) => {
      element.addEventListener('click', this.onAddNote);
    });
  }

  onAddNote(e) {
    let note = {};
    console.log('Add event!');
    console.log(e);
    this.noteModel.addNote(note);
    e.preventDefault();
    e.stopPropagation();
  }


}

// Bootstrap Application
let noteModel = new NoteModel();
let noteView = new NoteView();
let noteController = new NoteController(noteView, noteModel);


console.log(noteModel.notes);

// localStorage.setItem("key", "value");
// localStorage.getItem("key");





//
// document.addEventListener("DOMContentLoaded", ()=>{
//   // Load fixtures
//   localStorage.setItem("notes", JSON.stringify(fixtures));
//
//
//   // let form = document.querySelector("form");
//   // form.onsubmit = (event) => {
//   //   let noteData = {};
//   //   noteData.title = document.getElementById("title").value;
//   //   noteData.description = document.getElementById("description").value;
//   //   noteData.due = document.getElementById("due").value;
//   //   localStorage.setItem("note", JSON.stringify(noteData));
//   //   event.preventDefault();
//   // };
// });
//
//





