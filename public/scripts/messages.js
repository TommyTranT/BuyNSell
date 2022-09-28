$(document).ready(function() {

  //message thread dropdown
  $('.thread-dropdown').click(function() {
    const messageThread = $(this).next();
    const displayStatus = messageThread.css('display');

    if (displayStatus === 'none') {
      messageThread.slideDown({duration: 700});
    } else if (displayStatus === 'block') {
      messageThread.slideUp({duration: 700});
    }
  });

});
