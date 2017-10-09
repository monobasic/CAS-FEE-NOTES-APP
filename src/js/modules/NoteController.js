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

    // Routing
    // Mapping of #hash - .hbs template name
    this.pages = {
      home: 'home',
      add: 'add',
      edit: 'edit'
    };

    // Attach #hash change listener to rendering the current page
    window.addEventListener("hashchange", () => {
      this.renderPage();
      //history.pushState(null, this.getCurrentPage(), location.hash);
    });

    // Initial page render
    this.renderPage();
  }

  gotoPage(page) {
    location.hash = page;
  }

  getPage() {
    const hash = location.hash.split('?')[0] || "#home";
    return this.pages[hash.substr(1)];
  };

  getIdFromUrl() {
    return this.getQueryString('id');
  }

  getQueryString(field, url) {
    let href = url ? url : window.location.href;
    let reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    let string = reg.exec(href);
    return string ? string[1] : null;
  };

  renderPage() {
    console.log('render current page:' + this.getPage());

    this.noteModel.loadTemplate(this.getPage()).then((response) => {
      let wrapper = document.getElementById('wrapper');
      let noteTemplate = Handlebars.compile(response);
      wrapper.innerHTML = noteTemplate();

      // Attach page specific handlers and methods
      switch(this.getPage()) {
        case 'add':
            document.querySelectorAll('.js-note-add').forEach((element) => {
              element.addEventListener('click', this.onAddNote.bind(this));
            });
            this.handlePriorityList();
            this.renderDatePicker();
          break;
        case 'edit':
          let note = this.noteModel.getNote(this.getIdFromUrl());
          this.renderNoteEdit(note);
          break;
        default:
          document.getElementById('sort-by-date-due').addEventListener('click', this.onSortByDateDue.bind(this));
          document.getElementById('sort-by-date-created').addEventListener('click', this.onSortByDateCreated.bind(this));
          document.getElementById('sort-by-date-finished').addEventListener('click', this.onSortByDateCreated.bind(this));
          document.getElementById('sort-by-priority').addEventListener('click', this.onSortByPriority.bind(this));
          document.getElementById('show-finished').addEventListener('click', this.onShowFinished.bind(this));
          this.renderNotesList(this.noteModel.filterFinished(this.noteModel.getNotes()));
          this.handleStyleSwitcher();
          break;
      }

    }, (error) => {
      console.error("Failed!", error);
    });
  };

  // Helper function to find out the index of some siblings element
  getElIndex(element) {
    let i;
    for (i = 0; element = element.previousElementSibling; i++);
    return i;
  }

  onAddNote(e) {
    // Fetch data
    let note = {};
    note.title = document.getElementById('title').value;
    note.description = document.getElementById('description').value;
    note.priority = document.getElementById('priority').value;
    note.due = moment(document.getElementById('due').value, 'DD.MM.YYYY').format('YYYY-MM-DD');

    // Save the note, model!
    this.noteModel.addNote(note);

    // Back to Overview..
    this.gotoPage('home');

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

  handlePriorityList(defaultPriority) {
    let priorityList = document.getElementById('list-priority');
    let priorityLinks = priorityList.querySelectorAll('a');

    priorityLinks.forEach((element) => {
      element.addEventListener('click', (e) => {
        let target = e.currentTarget;
        this.setPriority(this.getElIndex(target.parentNode) + 1, priorityList);
        e.preventDefault();
      });
    });

    if (defaultPriority) {
      this.setPriority(defaultPriority, priorityList);
    }
  }

  setPriority(priority, priorityList) {
    let priorityLinks = priorityList.querySelectorAll('a');

    priorityLinks.forEach((element, index) => {
      index <= priority-1 ? element.classList.add('active') : element.classList.remove('active');
    });
    document.getElementById('priority').value = priority;
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

  renderNoteEdit(note) {
    this.noteModel.loadTemplate('note-edit').then((response) => {
      let noteTemplate = Handlebars.compile(response);
      let target = document.getElementById('note-edit');
      target.innerHTML = noteTemplate(note);

      this.handlePriorityList(note.priority);
      //this.renderDatePicker();
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
