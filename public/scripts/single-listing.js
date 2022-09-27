$(document).ready(function() {

  //message seller dropdown
  $('#message-dropdown').click(function() {
    const writeMessage = $('#write-message');
    //const error = $('#error-banner');
    const displayStatus = writeMessage.css('display');
    if (displayStatus === 'none') {
      writeMessage.slideDown({duration: 500});
    } else if (displayStatus === 'block') {
      //error.slideUp({duration: 500});
      writeMessage.slideUp({duration: 500});
    }
  });

});
