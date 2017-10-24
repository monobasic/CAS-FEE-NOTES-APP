export default class Dom {

  // Helper function to find out the index of some siblings
  static getElIndex(element) {
    let i;
    for (i = 0; element = element.previousElementSibling; i++);
    return i;
  }

};
