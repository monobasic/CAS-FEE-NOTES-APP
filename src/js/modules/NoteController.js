import Handlebars from '../../../node_modules/handlebars/dist/handlebars';
import Pikaday from 'pikaday';

export default class NoteController {

  constructor(noteView, noteModel) {
    this.noteView = noteView;
    this.noteModel = noteModel;

    // This needs to be refatored either with a router or multiple controllers
    this.currentPage = location.href.split("/").slice(-1).join('');
    this.attachListeners();

    if (this.currentPage === 'add.html') {
      this.handlePriorityList();
      this.handleDatePicker();
    } else {
      this.handleNotesList(this.noteModel.getNotes());
      this.handleStyleSwitcher();
    }
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

    document.getElementById('sort-by-date-due').addEventListener('click', this.onSortByDateDue.bind(this));
    document.getElementById('sort-by-date-created').addEventListener('click', this.onSortByDateCreated.bind(this));
    document.getElementById('sort-by-date-finished').addEventListener('click', this.onSortByDateCreated.bind(this));
    document.getElementById('sort-by-priority').addEventListener('click', this.onSortByPriority.bind(this));
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

  onSortByDateDue(e) {
    let sortedNotes = this.noteModel.sortByDateDue(this.noteModel.notes);
    let sortOptions = document.getElementById('sort-options');
    this.handleNotesList(sortedNotes);
    Array.from(sortOptions.children).map((element) => {
      return element.id === e.currentTarget.id ? element.classList.add('active') : element.classList.remove('active');
    });
    e.preventDefault();
  }

  onSortByDateCreated(e) {
    let sortedNotes = this.noteModel.sortByDateCreated(this.noteModel.notes);
    let sortOptions = document.getElementById('sort-options');
    this.handleNotesList(sortedNotes);
    Array.from(sortOptions.children).map((element) => {
      return element.id === e.currentTarget.id ? element.classList.add('active') : element.classList.remove('active');
    });
    e.preventDefault();
  }

  onSortByDateFinished(e) {
    let sortedNotes = this.noteModel.sortByDateFinished(this.noteModel.notes);
    let sortOptions = document.getElementById('sort-options');
    this.handleNotesList(sortedNotes);
    Array.from(sortOptions.children).map((element) => {
      return element.id === e.currentTarget.id ? element.classList.add('active') : element.classList.remove('active');
    });
    e.preventDefault();
  }

  onSortByPriority(e) {
    let sortedNotes = this.noteModel.sortByPriority(this.noteModel.notes);
    let sortOptions = document.getElementById('sort-options');
    this.handleNotesList(sortedNotes);
    Array.from(sortOptions.children).map((element) => {
      return element.id === e.currentTarget.id ? element.classList.add('active') : element.classList.remove('active');
    });
    e.preventDefault();
  }

  handlePriorityList() {
    let priorityList = document.getElementById('list-priority');
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

  handleNotesList(notes) {
    this.noteModel.loadTemplate('note-list-item').then((response) => {
      let noteTemplate = Handlebars.compile(response);
      this.noteView.renderNotesList(noteTemplate, notes);
    }, (error) => {
      console.error("Failed!", error);
    });
  }

  handleDatePicker() {
    this.datepicker = new Pikaday({
      field: document.getElementById('due'),
      format: 'D.MM.YYYY'
    });
  }

  handleStyleSwitcher() {
    let switcher = document.getElementById('style-switch');
    switcher.addEventListener('change', (e) => {
      let themeName = e.currentTarget.value;
      if (themeName.length) {
        // Update css include tag
        document.getElementById('theme-link').setAttribute('href', 'css/' + themeName + '/styles.min.css');
      }
    });

  }
}

