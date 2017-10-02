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
    console.log('View render: ');
    console.log(template);
    console.log(data);
  }
}
