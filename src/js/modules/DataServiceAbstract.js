'use strict';

export default class DataServiceAbstract {

  constructor() {
    if (this.constructor === DataServiceAbstract) {
      throw new TypeError('Abstract class "DataServiceAbstract" cannot be instantiated directly.');
    }

    if (this.getNotes === undefined) {
      throw new TypeError('You have to implement the method getNotes()');
    }
    if (this.getNote === undefined) {
      throw new TypeError('You have to implement the method getNote()');
    }
    if (this.addNote === undefined) {
      throw new Error('You have to implement the method addNote()');
    }
    if (this.deleteNote === undefined) {
      throw new Error('You have to implement the method deleteNote()');
    }
    if (this.updateNote === undefined) {
      throw new Error('You have to implement the method updateNote()');
    }
  }
}
