$(() => {
  $('.js-style-switch').change(function() {
    console.log(this.value);
    let themeName = $(this).val();
    if (themeName.length) {
      // Update css include tag
      $('#theme-link').attr('href', 'css/' + themeName + '/styles.min.css');
    }
  });
});
