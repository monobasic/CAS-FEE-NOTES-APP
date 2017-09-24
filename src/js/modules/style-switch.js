import $ from 'jquery';

export default (() => {
  $(() => {
    $('.js-style-switch').change(function() {
      let themeName = $(this).val();
      if (themeName.length) {
        // Update css include tag
        $('#theme-link').attr('href', 'css/' + themeName + '/styles.min.css');
      }
    });
  });
})();


