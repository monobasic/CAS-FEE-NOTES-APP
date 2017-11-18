import DataServiceAbstract from './DataServiceAbstract';

export default class DataServiceRest extends DataServiceAbstract {

  constructor() {
    super();
    this.api = 'http://127.0.0.1:3001';
  }

  _requestAsync(method='get', path, body=false) {
    const request = new Request(`${this.api}${path}`, {
      method: method,
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: body
    });

    return fetch(request).then((response) => response.json()).catch(function() {
      console.log('api error occured');
    });
  }

  getNotes() {
    return this._requestAsync('get', '/notes');
  }

  getNote(id) {
    return this._requestAsync('get', `/notes/${id}`);
  }

  addNote(note) {
    return this._requestAsync('post', '/notes', JSON.stringify(note));
  }

  deleteNote(id) {
    return this._requestAsync('delete', `/notes/${id}`);
  }

  updateNote(id, data) {
    return this._requestAsync('put', `/notes/${id}`, JSON.stringify(data));
  }
}
