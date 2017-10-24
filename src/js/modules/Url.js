export default class Url {

  static getHash() {
    const hash = location.hash.split('?')[0] || "#home";
    return hash.substr(1);
  }

  static setHash(page) {
    location.hash = page;
  }

  static getQueryString(field, url) {
    let href = url ? url : window.location.href;
    const reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    let string = reg.exec(href);
    return string ? string[1] : null;
  }

  static getIdFromUrl() {
    return this.getQueryString('id');
  }

};
