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

    //navigation controller
    // const navContact = document.getElementById('navContact');
    // navContact.addEventListener('click',
    //   function (e) {
    //     e.preventDefault();
    //     history.pushState(null, 'Contact', "#contact");
    //     renderCurrentPartial()
    //   });

    // Attach #hash change listener to rendering the current page
    window.addEventListener("hashchange", this.renderCurrentPage.bind(this));

    // Initial page render
    this.renderCurrentPage();
  }

  getCurrentPage() {
    const hash = location.hash || "#home";
    return this.pages[hash.substr(1)];
  };

  renderCurrentPage() {
    console.log('render current page:' + this.getCurrentPage());

    this.noteModel.loadTemplate(this.getCurrentPage()).then((response) => {
      let wrapper = document.getElementById('wrapper');
      let noteTemplate = Handlebars.compile(response);
      wrapper.innerHTML = noteTemplate();

      // Attach page specific handlers and methods
      switch(this.getCurrentPage()) {
        case 'add':
            document.querySelectorAll('.js-note-add').forEach((element) => {
              element.addEventListener('click', this.onAddNote.bind(this));
            });
            this.handlePriorityList();
            this.renderDatePicker();
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
