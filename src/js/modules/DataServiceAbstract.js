export default class DataServiceAbstract {

  constructor() {
    if (this.constructor === DataServiceAbstract) {
      throw new TypeError('Abstract class "DataServiceAbstract" cannot be instantiated directly.');
    }
  }

  // Implementation required:
  getNotes() {
    throw new Error('You have to implement the method getNotes()');
  }
  getNote() {
    throw new Error('You have to implement the method getNote()');
  }
  addNote() {
    throw new Error('You have to implement the method addNote()');
  }
  deleteNote() {
    throw new Error('You have to implement the method deleteNote()');
  }
}
