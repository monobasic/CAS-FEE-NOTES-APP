export default class NoteController {

  constructor(noteView, noteModel) {
    this.noteView = noteView;
    this.noteModel = noteModel;
    this.attachListeners();
  }

  attachListeners() {
    document.querySelectorAll('.js-note-add').forEach((element) => {
      element.addEventListener('click', this.onAddNote.bind(this));
    });
  }

  onAddNote(e) {
    let note = {};

    note.title = document.getElementById('title').value;
    note.description = document.getElementById('description').value;
    note.priority = document.getElementById('priority').value;
    note.due = document.getElementById('due').value;

    this.noteModel.addNote(note);

    e.preventDefault();
    e.stopPropagation();
  }
}

