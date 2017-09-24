import $ from 'jquery';
import moment from 'moment';

console.log('hello world from app.js');

$(function() {
  console.log('jQuery Version: ' + $.fn.jquery);
});

console.log('moment.js: ' + moment.version);
