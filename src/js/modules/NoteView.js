import Pikaday from 'pikaday';

export default class NoteView {

  constructor() {
    this.datepicker = new Pikaday({
      field: document.getElementById('due'),
      format: 'D.MM.YYYY'
    });
  }

  renderNotesList(html) {
    let list = document.getElementById('list-notes');
    list.innerHTML = html;
  }
}
