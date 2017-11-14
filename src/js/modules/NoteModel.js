export default class NoteModel {

  constructor(dataService) {
    this._dataService = dataService;
  }

  getNotes(orderBy = 'due', filterFinished = false, direction = 'asc') {
    return this._dataService.getNotes().then((notes) => {
      return filterFinished ? this._filterFinished(this._sortBy(orderBy, notes, direction)) : this._sortBy(orderBy, notes, direction);
    }).catch(() => {
      console.log('Follow up error occured in model due API error');
    });
  }

  getNote(id) {
    return this._dataService.getNote(id).then((note) => note);
  }

  addNote(note) {
    return this._dataService.addNote(note).then((newNote) => newNote);
  }

  deleteNote(id) {
    return this._dataService.deleteNote(id).then((numRemoved) => numRemoved);
  }

  updateNote(id, data) {
    return this._dataService.updateNote(id, data).then((numReplaced) => numReplaced);
  }

  _sortBy(sort = 'due', notes, direction = 'asc') {
    return notes.sort((a, b) => direction === 'asc' ? a[sort] > b[sort] : a[sort] < b[sort]);
  }

  _filterFinished(notes) {
    return notes.filter(note => !note.finished);
  }

  loadTemplate(template) {
    const request = new Request(`./templates/${template}.hbs?${new Date().getTime()}`, {
      method: 'get',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'text/x-handlebars-template'
      })
    });
    return fetch(request).then((response) => response.text()).catch(function() {
      console.log('Template loading error occured');
    });
  }

}
