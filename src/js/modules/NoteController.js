import moment from 'moment';
import Handlebars from '../../../node_modules/handlebars/dist/handlebars';
import Pikaday from 'pikaday';

export default class NoteController {

  constructor(noteModel) {
    this.noteModel = noteModel;

    // Handlebars Date Format Helper
    Handlebars.registerHelper('formatDate', function(iso) {
      return moment(iso).format('DD.MM.YYYY');
    });

    // This needs to be refatored either with a router or multiple controllers
    this.currentPage = location.href.split("/").slice(-1).join('');

    if (this.currentPage === 'add.html') {
      this.attachListenersAdd();
      this.handlePriorityList();
      this.renderDatePicker();
    } else {
      this.attachListenersIndex();
      this.renderNotesList(this.noteModel.filterFinished(this.noteModel.getNotes()));
      this.handleStyleSwitcher();
    }
  }

  getElIndex(element) {
    let i;
    for (i = 0; element = element.previousElementSibling; i++);
    return i;
  }

  attachListenersIndex() {
    document.getElementById('sort-by-date-due').addEventListener('click', this.onSortByDateDue.bind(this));
    document.getElementById('sort-by-date-created').addEventListener('click', this.onSortByDateCreated.bind(this));
    document.getElementById('sort-by-date-finished').addEventListener('click', this.onSortByDateCreated.bind(this));
    document.getElementById('sort-by-priority').addEventListener('click', this.onSortByPriority.bind(this));

    document.getElementById('show-finished').addEventListener('click', this.onShowFinished.bind(this));
  }

  attachListenersAdd() {
    document.querySelectorAll('.js-note-add').forEach((element) => {
      element.addEventListener('click', this.onAddNote.bind(this));
    });
  }

  onAddNote(e) {
    let note = {};
    note.title = document.getElementById('title').value;
    note.description = document.getElementById('description').value;
    note.priority = document.getElementById('priority').value;
    note.due = moment(document.getElementById('due').value, 'DD.MM.YYYY').format('YYYY-MM-DD');

    this.noteModel.addNote(note);
    e.preventDefault();
    e.stopPropagation();
  }

  onSortByDateDue(e) {
    let sortedNotes = this.noteModel.sortByDateDue(this.noteModel.getNotes());
    this.renderNotesList(sortedNotes);
    this.updateSortOptions(e);
    e.preventDefault();
  }

  onSortByDateCreated(e) {
    let sortedNotes = this.noteModel.sortByDateCreated(this.noteModel.getNotes());
    this.renderNotesList(sortedNotes);
    this.updateSortOptions(e);
    e.preventDefault();
  }

  onSortByDateFinished(e) {
    let sortedNotes = this.noteModel.sortByDateFinished(this.noteModel.getNotes());
    this.renderNotesList(sortedNotes);
    this.updateSortOptions(e);
    e.preventDefault();
  }

  onSortByPriority(e) {
    let sortedNotes = this.noteModel.sortByPriority(this.noteModel.getNotes());
    this.renderNotesList(sortedNotes);
    this.updateSortOptions(e);
    e.preventDefault();
  }

  onShowFinished(e) {
    let notes = this.noteModel.getNotes();
    this.renderNotesList(notes);
    e.preventDefault();
  }

  updateSortOptions(e) {
    let sortOptions = document.getElementById('sort-options');
    Array.from(sortOptions.children).map((element) => {
      return element.id === e.currentTarget.id ? element.classList.add('active') : element.classList.remove('active');
    });
  }

  handlePriorityList() {
    let priorityList = document.getElementById('list-priority');
    let priorityLinks = priorityList.querySelectorAll('a');
    priorityLinks.forEach((element) => {
      element.addEventListener('click', (e) => {
        let target = e.currentTarget;
        priorityLinks.forEach((element, index) => {
          index <= this.getElIndex(target.parentNode) ? element.classList.add('active') : element.classList.remove('active');
        });
        document.getElementById('priority').value = this.getElIndex(target.parentNode) + 1;
        e.preventDefault();
      });
    });
  }

  renderNotesList(notes) {
    this.noteModel.loadTemplate('note-list-item').then((response) => {
      let noteTemplate = Handlebars.compile(response);
      let list = document.getElementById('list-notes');
      list.innerHTML = '';
      notes.forEach((note) => {
        list.innerHTML += noteTemplate(note);
      });
    }, (error) => {
      console.error("Failed!", error);
    });
  }

  renderDatePicker() {
    this.datepicker = new Pikaday({
      field: document.getElementById('due'),
      format: 'DD.MM.YYYY'
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
