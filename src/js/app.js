// app.js
console.log('hello world from app.js');

import $ from 'jquery';
import moment from 'moment';

$(function() {
  $('body').css('background', 'hotpink');
});

console.log(moment().format());
