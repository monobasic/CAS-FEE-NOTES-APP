import Handlebars from '../../../node_modules/handlebars/dist/handlebars';

export default class NoteController {

  constructor(noteView, noteModel) {
    this.noteView = noteView;
    this.noteModel = noteModel;
    this.attachListeners();
    this.handlePriorityList();
    this.handleNotesList();
  }

  getElIndex(element) {
    let i;
    for (i = 0; element = element.previousElementSibling; i++);
    return i;
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

  handlePriorityList() {
    let priorityList = document.getElementById('list-priority');
    if (!priorityList) {
      return false;
    }
    let priorityLinks = priorityList.querySelectorAll('a');
    priorityLinks.forEach((element) => {
      element.addEventListener('click', (e) => {
        let target = e.currentTarget;
        priorityLinks.forEach((element, index) => {
          if (index <= this.getElIndex(target.parentNode)) {
            element.classList.add('active');
          } else {
            element.classList.remove('active');
          }
        });
        document.getElementById('priority').value = this.getElIndex(target.parentNode) + 1;
        e.preventDefault();
      });
    });
  }

  handleNotesList() {
    this.noteModel.loadTemplate('note-list-item').then((response) => {
      let notesListHtml = '';
      let noteTemplate = Handlebars.compile(response);
      let notesData = this.noteModel.getNotes();

      notesData.forEach((note) => {
        notesListHtml += noteTemplate(note);
      });

      this.noteView.renderNotesList(notesListHtml);
    }, (error) => {
      console.error("Failed!", error);
    });
  }
}

