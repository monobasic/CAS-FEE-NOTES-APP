import Pikaday from 'pikaday';

export default class NoteView {

  constructor() {
    this.handlePriorityList();
    this.datepicker = new Pikaday({
      field: document.getElementById('due'),
      format: 'D.MM.YYYY'
    });
  }

  handlePriorityList() {
    let priorityList = document.getElementById('list-priority');
    if (!priorityList) {
      return false;
    }
    let priorityLinks = priorityList.querySelectorAll('a');
    priorityLinks.forEach((element) => {
      element.addEventListener('click', (e) => {
        let target = e.currentTarget;
        priorityLinks.forEach((element, index) => {
          if (index <= this.getElIndex(target.parentNode)) {
            element.classList.add('active');
          } else {
            element.classList.remove('active');
          }
        });
        document.getElementById('priority').value = this.getElIndex(target.parentNode) + 1;
        e.preventDefault();
      });
    });
  }

  renderNotesList(notes) {
    console.log('Render Notes List...');
  }

  getElIndex(element) {
    let i;
    for (i = 0; element = element.previousElementSibling; i++);
    return i;
  }
}
