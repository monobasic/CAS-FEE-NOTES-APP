// Import Dependencies
import moment from 'moment';
import Pikaday from 'pikaday';
import Handlebars from 'handlebars';
import handlebarsHelpers from './HandlebarsHelpers';

// Import Helper Modules
import Url from './Url';
import Dom from './Dom';

export default class NoteController {

  constructor(noteModel) {
    // Model instance
    this.noteModel = noteModel;

    // Init Handlebars Helpers
    handlebarsHelpers();

    // Object keeps track of UI's current theme, sorting and filtering
    this.ui = {
      theme: 'default',
      orderBy: 'due',
      filterFinished: true
    };

    // Routing
    // Attach #hash change listener to rendering the current page
    window.addEventListener("hashchange", () => {
      this.changePage(Url.getHash());
    });

    // Initial page render
    this.changePage(Url.getHash());
  }


  // Page specific handlers and methods
  changePage(page) {
    let pageWrapper = document.getElementById('wrapper');
    let note;

    switch(page) {

    // Add note view
    case 'add':
      this.renderTemplate(pageWrapper, page, null, () => {
        document.getElementById('form-note-add').addEventListener('submit', this.onAddNote.bind(this));
        this.handlePriorityList();
        this.handleDatePickers();
      });
      break;

      // Edit note view
    case 'edit':
      this.noteModel.getNote(Url.getIdFromUrl()).then((note) => {
        this.renderTemplate(pageWrapper, page, note, () => {
          this.handlePriorityList(note.priority);
          this.handleDatePickers();
          document.getElementById('form-note-edit').addEventListener('submit', (e) => {
            this.onUpdateNote(e, note._id);
          });
          document.getElementById('item-finished').addEventListener('click', this.onToggleFinished.bind(this));
          document.getElementById('note-delete').addEventListener('click', (e) => {
            this.onDeleteNote(e, note._id);
          });
        });
      });
      break;

    // Home / note list view
    default:
      this.renderTemplate(pageWrapper, page, null, () => {
        // Sorting handlers
        document.querySelectorAll('[data-sort-by]').forEach((element) => {
          element.addEventListener('click', (e) => {
            const sortBy = e.target.getAttribute('data-sort-by');
            this.renderNotes(sortBy, this.ui.filterFinished);
            this.updateSortOptions(sortBy);
            e.preventDefault();
          });
        });
        // "Show finished" handler
        document.getElementById('show-finished').addEventListener('click', (e) => {
          this.ui.filterFinished = !this.ui.filterFinished;
          this.renderNotes(this.ui.orderBy, this.ui.filterFinished);
          this.updateFilterOptions(this.ui.filterFinished);
          e.preventDefault();
        });

        // Initially render notes
        this.renderNotes(this.ui.orderBy, this.ui.filterFinished);
        this.updateSortOptions(this.ui.orderBy);
        this.updateFilterOptions(this.ui.filterFinished);
        this.handleStyleSwitcher();
      });
      break;
    }
  }


  // Render methods
  renderTemplate(target, template, data, callback) {
    data = data || {};

    this.noteModel.loadTemplate(template).then((response) => {
      let noteTemplate = Handlebars.compile(response);
      target.innerHTML = noteTemplate(data);
      if (callback !== undefined) {
        callback();
      }
    }, (error) => {
      console.error("Template loading failed!", error);
    });
  }

  renderNotes(orderBy, filterFinished) {
    this.noteModel.getNotes(orderBy, filterFinished).then((notes) => {
      const data = {
        notes: notes
      };
      this.renderTemplate(document.getElementById('note-list-wrapper'), 'note-list', data, () => {
        // Attach checkbox handlers
        document.querySelectorAll('[data-action=note-finish]').forEach(element => element.addEventListener('change', this.onToggleFinished.bind(this)));
        // Set priority indicators
        document.querySelectorAll('.priority').forEach(element => {
          this.setPriority(element.getAttribute('data-priority'), element);
        });
      });

      // Persist current sorting/filtering
      this.ui.orderBy = orderBy;
      this.ui.filterFinished = filterFinished;
    });
  }


  // Event handlers
  onToggleFinished(e) {
    const checkbox = e.currentTarget;
    const noteId = checkbox.getAttribute('data-id');
    this.noteModel.getNote(noteId).then((note) => {
      if (checkbox.checked) {
        note.finished = true;
        note.finishedOn = moment().format('YYYY-MM-DD');
      } else {
        note.finished = false;
        note.finishedOn = '';
      }
      this.noteModel.updateNote(noteId, note).then(() => {});
      this.updateFinished(checkbox);
    });
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
    this.noteModel.addNote(note).then(() => {
      // Back to Overview..
      Url.setHash('home');
    });

    e.preventDefault();
  }

  onUpdateNote(e, noteId) {
    // Assign new data
    let data = {};
    data.title = document.getElementById('title').value;
    data.description = document.getElementById('description').value;
    data.priority = document.getElementById('priority').value;
    data.due = document.getElementById('due').value ? moment(document.getElementById('due').value, 'DD.MM.YYYY').format('YYYY-MM-DD') : '';
    data.finished = document.getElementById('item-finished').checked;
    data.finishedOn = document.getElementById('finished-on').value ? moment(document.getElementById('finished-on').value, 'DD.MM.YYYY').format('YYYY-MM-DD') : '';
    data.created = document.getElementById('created').value ? moment(document.getElementById('created').value, 'DD.MM.YYYY').format('YYYY-MM-DD') : '';

    // Update the note, model!
    this.noteModel.updateNote(noteId, data).then(() => {
      // Back to Overview..
      Url.setHash('home');
    });

    e.preventDefault();
  }

  onDeleteNote(e, noteId) {
    if (window.confirm("Do you really want to delete this note?")) {
      this.noteModel.deleteNote(noteId).then(() => {
        // Back to Overview..
        Url.setHash('home');
      });
    }
    e.preventDefault();
  }


  // UI update methods
  updateSortOptions(sortby) {
    const sortOptions = document.getElementById('sort-options');
    Array.from(sortOptions.children).map((element) => {
      return element.getAttribute('data-sort-by') === sortby ? element.classList.add('active') : element.classList.remove('active');
    });
  }

  updateFilterOptions(filterFinished) {
    const icon = document.getElementById('show-finished-status');
    if (filterFinished) {
      icon.classList.remove('fa-check-square-o');
      icon.classList.add('fa-square-o');
    } else {
      icon.classList.add('fa-check-square-o');
      icon.classList.remove('fa-square-o');
    }
  }

  updateFinished(checkbox) {
    const input = document.getElementById('finished-on');
    let label = document.querySelectorAll(`label[for=${checkbox.id}]`)[0];

    if (checkbox.checked) {
      // Finish note
      label.innerText = 'Finished: ' +  moment().format('DD.MM.YYYY'); // Directly update the label to prevent re-rendering
      if (input) {
        input.value = moment().format('DD.MM.YYYY'); // Directly update the input, if there, to prevent re-rendering
      }
    } else {
      // Un-finish note
      label.innerText = 'Finished'; // Directly update the label to prevent re-rendering
      if (input) {
        input.value = ''; // Directly update the input, if there, to prevent re-rendering
      }
    }
  }


  // Handle special UI elements
  setPriority(priority, priorityList) {
    let priorityItems = priorityList.querySelectorAll('.priority-item');
    let input = document.getElementById('priority');

    // Rebuild priority status
    priorityItems.forEach((element, index) => {
      index <= priority-1 ? element.classList.add('active') : element.classList.remove('active');
    });

    // Set hidden input field priority value
    if (input) {
      input.value = priority;
    }
  }

  handlePriorityList(priority) {
    const priorityList = document.getElementById('list-priority');
    let priorityLinks = priorityList.querySelectorAll('a');

    // Attach click handlers for each priority list element
    priorityLinks.forEach((element) => {
      element.addEventListener('click', (e) => {
        let target = e.currentTarget;
        this.setPriority(Dom.getElIndex(target.parentNode) + 1, priorityList);
        e.preventDefault();
      });
    });

    // Handle preset priority
    if (priority) {
      this.setPriority(priority, priorityList);
    }
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

    // Set switcher to current theme
    switcher.value = this.ui.theme;
    switcher.addEventListener('change', (e) => {
      let themeName = e.currentTarget.value;
      if (themeName.length) {
        // Set theme class variable
        this.ui.theme = themeName;
        // Update css include tag
        document.getElementById('theme-link').setAttribute('href', 'css/' + themeName + '/styles.min.css');
      }
    });
  }
}
