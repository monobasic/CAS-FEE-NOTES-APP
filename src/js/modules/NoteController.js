'use strict';

import moment from 'moment';
import Handlebars from 'handlebars';
import Pikaday from 'pikaday';

export default class NoteController {

  constructor(noteModel) {
    // Model instance
    this.noteModel = noteModel;

    // Handlebars Date Format Helper
    Handlebars.registerHelper('formatDate', (iso) => iso ? moment(iso).format('DD.MM.YYYY') : '');

    // Handlebars String Truncate (Whole words only) Helper
    Handlebars.registerHelper ('truncate', (str, len) => {
      if (str.length > len && str.length > 0) {
        let newStr = str + ' ';
        newStr = str.substr (0, len);
        newStr = str.substr (0, newStr.lastIndexOf(' '));
        newStr = (newStr.length > 0) ? newStr : str.substr (0, len);
        return new Handlebars.SafeString(newStr + ' ...');
      }
      return str;
    });

    // Object keeps track of UI's current theme, sorting and filtering
    this.ui = {
      theme: 'default',
      orderBy: 'due',
      filterFinished: true
    };

    // Attach #hash change listener to rendering the current page
    window.addEventListener("hashchange", () => {
      this.changePage(this.getHash());
    });

    // Initial page render
    this.changePage(this.getHash());
  }

  changePage(page) {
    let pageWrapper = document.getElementById('wrapper');
    let note;

    // Attach page specific handlers and methods
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
        note = this.noteModel.getNote(this.getIdFromUrl());
        this.renderTemplate(pageWrapper, page, note, () => {
          this.handlePriorityList(note.priority);
          this.handleDatePickers();
          document.getElementById('form-note-edit').addEventListener('submit', (e) => {
            this.onUpdateNote(e, note);
          });
          document.getElementById('item-finished').addEventListener('click', (e) => {
            this.onToggleFinishedEdit(e, note);
          });
          document.getElementById('note-delete').addEventListener('click', (e) => {
            this.onDeleteNote(e, note);
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

  gotoPage(page) {
    location.hash = page;
  }

  getHash() {
    const hash = location.hash.split('?')[0] || "#home";
    return hash.substr(1);
  }

  getIdFromUrl() {
    return this.getQueryString('id');
  }

  getQueryString(field, url) {
    let href = url ? url : window.location.href;
    const reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
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
      console.error("Template loading failed!", error);
    });
  }

  // Helper function to find out the index of siblings
  getElIndex(element) {
    let i;
    for (i = 0; element = element.previousElementSibling; i++);
    return i;
  }

  onToggleFinished(e) {
    const checkbox = e.currentTarget;
    let label = document.querySelectorAll(`label[for=${checkbox.id}]`)[0];
    const noteId = checkbox.getAttribute('data-id');
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

  onToggleFinishedEdit(e, note) {
    const checkbox = e.currentTarget;
    const noteId = note.id;

    if (checkbox.checked) {
      // Finish note
      note.finished = true;
      note.finishedOn = moment().format('YYYY-MM-DD');
      document.getElementById('finished-on').value = moment().format('DD.MM.YYYY');
    } else {
      // Un-finish note
      note.finished = false;
      note.finishedOn = '';
      document.getElementById('finished-on').value = '';
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

  onDeleteNote(e, note) {
    if (window.confirm("Do you really want to delete this note?")) {
      this.noteModel.deleteNote(note.id);
      // Back to Overview..
      this.gotoPage('home');
    }
    e.preventDefault();
  }

  renderNotes(orderBy, filterFinished) {
    const data = {
      notes: this.noteModel.getNotes(orderBy, filterFinished)
    };
    this.renderTemplate(document.getElementById('note-list-wrapper'), 'note-list', data);

    // Persist current sorting/filtering
    this.ui.orderBy = orderBy;
    this.ui.filterFinished = filterFinished;
  }

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

  handlePriorityList(priority) {
    const priorityList = document.getElementById('list-priority');
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
