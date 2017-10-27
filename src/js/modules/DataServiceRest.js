import DataServiceAbstract from './DataServiceAbstract';

export default class DataServiceRest extends DataServiceAbstract {

  constructor() {
    super();

    this.api = 'http://127.0.0.1:3001';
  }

  getNotes() {
    const request = new Request(`${this.api}/notes`, {
      method: 'get',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    return fetch(request).then((response) => response.json()).catch(function() {
      console.log('api error occured');
    });
  }

  getNote(id) {
    const request = new Request(`${this.api}/notes/${id}`, {
      method: 'get',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    return fetch(request).then((response) => response.json()).catch(function() {
      console.log('api error occured');
    });
  }

  addNote(note) {
    const request = new Request(`${this.api}/notes`, {
      method: 'post',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(note)
    });

    return fetch(request).then((response) => response.json()).catch(function() {
      console.log('api error occured');
    });
  }

  deleteNote(id) {

  }

  updateNote(id, data) {

  }
}
