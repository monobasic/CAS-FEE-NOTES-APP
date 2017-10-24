import moment from 'moment';
import Handlebars from 'handlebars';

export default function() {

  // Handlebars Date Format Helper
  Handlebars.registerHelper('formatDate', (iso) => iso ? moment(iso).format('DD.MM.YYYY') : '');

  // Handlebars String Truncate (Whole words only) Helper
  Handlebars.registerHelper ('truncate', (str, len) => {
    if (str.length > len && str.length > 0) {
      let newStr = str + ' ';
      newStr = str.substr (0, len);
      newStr = str.substr (0, newStr.lastIndexOf(' '));
      newStr = (newStr.length > 0) ? newStr : str.substr (0, len);
      return new Handlebars.SafeString(newStr + ' ...');
    }
    return str;
  });
}
