export default class DataServiceAbstract {

  constructor() {
    if (this.constructor === DataServiceAbstract) {
      throw new TypeError('Abstract class "DataServiceAbstract" cannot be instantiated directly.');
    }

    const methods = [
      'getNotes',
      'getNote',
      'addNote',
      'deleteNote',
      'updateNote'
    ];

    methods.forEach((method) => {
      if (this[method] === undefined) {
        throw new TypeError(`You have to implement the method ${method}()`);
      }
    });
  }
}
