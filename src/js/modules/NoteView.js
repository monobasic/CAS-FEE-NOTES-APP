import Pikaday from 'pikaday';

export default class NoteView {

  constructor() {
    this.datepicker = new Pikaday({
      field: document.getElementById('due'),
      format: 'D.MM.YYYY'
    });
  }

  renderNotesList(template, data) {
    let list = document.getElementById('list-notes');
    data.forEach((note) => {
      list.innerHTML += template(note);
    });
  }
}
