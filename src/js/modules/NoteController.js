import moment from 'moment';
import Handlebars from '../../../node_modules/handlebars/dist/handlebars';
import Pikaday from 'pikaday';

export default class NoteController {

  constructor(noteModel) {
    this.noteModel = noteModel;

    // Handlebars Date Format Helper
    Handlebars.registerHelper('formatDate', (iso) => iso ? moment(iso).format('DD.MM.YYYY') : '');

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
    let pageWrapper = document.getElementById('wrapper');
    let note;
    // Attach page specific handlers and methods
    switch(page) {
    case 'add':
      this.renderTemplate(pageWrapper, page, null, () => {
        document.getElementById('form-note-add').addEventListener('submit', this.onAddNote.bind(this));
        this.handlePriorityList();
        this.handleDatePickers();
      });
      break;

    case 'edit':
      note = this.noteModel.getNote(this.getIdFromUrl());
      this.renderTemplate(pageWrapper, page, note, () => {
        this.handlePriorityList(note.priority);
        this.handleDatePickers();
        document.getElementById('form-note-edit').addEventListener('submit', (e) => {
          this.onUpdateNote(e, note);
        });
      });
      break;

    default:
      this.renderTemplate(pageWrapper, page, null, () => {
        document.getElementById('sort-by-date-due').addEventListener('click', this.onSortByDateDue.bind(this));
        document.getElementById('sort-by-date-created').addEventListener('click', this.onSortByDateCreated.bind(this));
        document.getElementById('sort-by-date-finished').addEventListener('click', this.onSortByDateCreated.bind(this));
        document.getElementById('sort-by-priority').addEventListener('click', this.onSortByPriority.bind(this));
        //document.getElementById('show-finished').addEventListener('click', this.onShowFinished.bind(this));
        this.handleStyleSwitcher();

        // Initially, get notes sorted by due date
        let data = {
          notes: this.noteModel.sortByDateDue(this.noteModel.getNotes())
        };

        // Render notes list sub-template
        this.renderTemplate(document.getElementById('note-list-wrapper'), 'note-list', data, () => {
          // Handle finish check boxes
          document.querySelectorAll('[data-action=note-finish]').forEach(element => element.addEventListener('change', this.onToggleFinished.bind(this)));
        });

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
  }

  getIdFromUrl() {
    return this.getQueryString('id');
  }

  getQueryString(field, url) {
    let href = url ? url : window.location.href;
    let reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    let string = reg.exec(href);
    return string ? string[1] : null;
  }

  renderTemplate(target, template, data, callback) {
    data = data || {};

    this.noteModel.loadTemplate(template).then((response) => {
      let noteTemplate = Handlebars.compile(response);
      target.innerHTML = noteTemplate(data);
      if (callback !== undefined) {
        callback();
      }
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

  onToggleFinished(e) {
    let checkbox = e.currentTarget;
    let label = document.querySelectorAll(`label[for=${checkbox.id}]`)[0];
    let noteId = checkbox.getAttribute('data-id');
    let note = this.noteModel.getNote(noteId);

    if (checkbox.checked) {
      // Finish note
      note.finished = true;
      note.finishedOn = moment().format('YYYY-MM-DD');
      label.innerText = 'Finished: ' +  moment().format('DD.MM.YYYY'); // Directly update the label to prevent re-rendering of the notes-list
    } else {
      // Un-finish note
      note.finished = false;
      note.finishedOn = '';
      label.innerText = 'Finished'; // Directly update the label to prevent re-rendering of the notes-list
    }

    this.noteModel.updateNote(noteId, note);
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
  }

  onUpdateNote(e, note) {
    // Assign new data
    note.title = document.getElementById('title').value;
    note.description = document.getElementById('description').value;
    note.priority = document.getElementById('priority').value;
    note.due = document.getElementById('due').value ? moment(document.getElementById('due').value, 'DD.MM.YYYY').format('YYYY-MM-DD') : '';
    note.finishedOn = document.getElementById('finished-on').value ? moment(document.getElementById('finished-on').value, 'DD.MM.YYYY').format('YYYY-MM-DD') : '';
    note.created = document.getElementById('created').value ? moment(document.getElementById('created').value, 'DD.MM.YYYY').format('YYYY-MM-DD') : '';

    // Update the note, model!
    this.noteModel.updateNote(note.id, note);

    // Back to Overview..
    this.gotoPage('home');

    e.preventDefault();
  }

  onSortByDateDue(e) {
    let data = {
      notes: this.noteModel.sortByDateDue(this.noteModel.getNotes())
    };
    this.renderTemplate(document.getElementById('note-list-wrapper'), 'note-list', data);
    this.updateSortOptions(e);
    e.preventDefault();
  }

  onSortByDateCreated(e) {
    let data = {
      notes: this.noteModel.sortByDateCreated(this.noteModel.getNotes())
    };
    this.renderTemplate(document.getElementById('note-list-wrapper'), 'note-list', data);
    this.updateSortOptions(e);
    e.preventDefault();
  }

  onSortByDateFinished(e) {
    let data = {
      notes: this.noteModel.sortByDateFinished(this.noteModel.getNotes())
    };
    this.renderTemplate(document.getElementById('note-list-wrapper'), 'note-list', data);
    this.updateSortOptions(e);
    e.preventDefault();
  }

  onSortByPriority(e) {
    let data = {
      notes: this.noteModel.sortByPriority(this.noteModel.getNotes())
    };
    this.renderTemplate(document.getElementById('note-list-wrapper'), 'note-list', data);
    this.updateSortOptions(e);
    e.preventDefault();
  }

  onShowFinished(e) {
    // TODO: implement...
    // let notes = this.noteModel.getNotes();
    // this.renderTemplate(document.getElementById('note-list-wrapper'), 'note-list', null);
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

  handleDatePickers() {
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
