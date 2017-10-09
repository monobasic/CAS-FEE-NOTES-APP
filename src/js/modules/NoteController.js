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
    // Mapping of #hash: page/template name
    this.pages = {
      home: 'home',
      add: 'add',
      edit: 'edit'
    };

    // Attach #hash change listener to rendering the current page
    window.addEventListener("hashchange", () => {
      this.changePage(this.getPageFromUrl());
    });

    // Initial page render
    this.changePage(this.getPageFromUrl());
  }

  changePage(page) {
    // Attach page specific handlers and methods
    switch(page) {
      case 'add':
        this.renderTemplate(page, null, () => {
          document.getElementById('note-add').addEventListener('click', this.onAddNote.bind(this));
          this.handlePriorityList();
          this.renderDatePickers();
        });
        break;
      case 'edit':
        let note = this.noteModel.getNote(this.getIdFromUrl());
        this.renderTemplate(page, note, () => {
          this.handlePriorityList(note.priority);
          this.renderDatePickers();
          document.getElementById('note-update').addEventListener('click', (e) => {
            this.onUpdateNote(note);
            e.preventDefault();
          });
        });
        break;
      default:
        this.renderTemplate(page, null, () => {
          document.getElementById('sort-by-date-due').addEventListener('click', this.onSortByDateDue.bind(this));
          document.getElementById('sort-by-date-created').addEventListener('click', this.onSortByDateCreated.bind(this));
          document.getElementById('sort-by-date-finished').addEventListener('click', this.onSortByDateCreated.bind(this));
          document.getElementById('sort-by-priority').addEventListener('click', this.onSortByPriority.bind(this));
          document.getElementById('show-finished').addEventListener('click', this.onShowFinished.bind(this));
          this.renderNotesList();
          this.handleStyleSwitcher();
        });
        break;
    }
  }

  gotoPage(page) {
    location.hash = page;
  }

  getPageFromUrl() {
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

  renderTemplate(template, data, callback) {
    data = data || {};

    this.noteModel.loadTemplate(template).then((response) => {
      let wrapper = document.getElementById('wrapper');
      let noteTemplate = Handlebars.compile(response);
      wrapper.innerHTML = noteTemplate(data);
      callback();
    }, (error) => {
      console.error("Failed!", error);
    });
  };

  renderNotesList(notes) {
    notes = notes || this.noteModel.getNotes();

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
    note.created = moment().format('YYYY-MM-DD');
    note.finishedOn = '';
    note.finished = false;

    // Save the note, model!
    this.noteModel.addNote(note);

    // Back to Overview..
    this.gotoPage('home');

    e.preventDefault();
    e.stopPropagation();
  }

  onUpdateNote(note) {
    // // Fetch data
    // note.title = document.getElementById('title').value;
    // note.description = document.getElementById('description').value;
    // note.priority = document.getElementById('priority').value;
    // note.due = moment(document.getElementById('due').value, 'DD.MM.YYYY').format('YYYY-MM-DD');
    // note.finishedOn = moment(document.getElementById('finished-on').value, 'DD.MM.YYYY').format('YYYY-MM-DD');
    // note.created = moment(document.getElementById('created').value, 'DD.MM.YYYY').format('YYYY-MM-DD');
    //
    // // Save the note, model!
    // this.noteModel.updateNote(note);
    //
    // // Back to Overview..
    // this.gotoPage('home');
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

  handlePriorityList(priority) {
    let priorityList = document.getElementById('list-priority');
    let priorityLinks = priorityList.querySelectorAll('a');

    // Attach click handlers for each priority list element
    priorityLinks.forEach((element) => {
      element.addEventListener('click', (e) => {
        let target = e.currentTarget;
        this.setPriority(this.getElIndex(target.parentNode) + 1, priorityList);
        e.preventDefault();
      });
    });

    // Handle preset priority
    if (priority) {
      this.setPriority(priority, priorityList);
    }
  }

  setPriority(priority, priorityList) {
    let priorityLinks = priorityList.querySelectorAll('a');

    // Rebuild priority status
    priorityLinks.forEach((element, index) => {
      index <= priority-1 ? element.classList.add('active') : element.classList.remove('active');
    });

    // Set hidden input field priority value
    document.getElementById('priority').value = priority;
  }

  renderDatePickers() {
    document.querySelectorAll('.datepicker').forEach(datepicker => {
      new Pikaday({
        field: datepicker,
        format: 'DD.MM.YYYY'
      });
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
