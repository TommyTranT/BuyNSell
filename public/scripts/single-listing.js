$(document).ready(function() {

  //message seller dropdown
  $('#message-dropdown').click(function(event) {
    event.preventDefault();
    const writeMessage = $('#write-message');
    const displayStatus = writeMessage.css('display');
    if (displayStatus === 'none') {
      writeMessage.slideDown({duration: 500});
    } else if (displayStatus === 'block') {
      writeMessage.slideUp({duration: 500});
    }
  });

  $(".add-favorite").click(function() {
    const user_id = $("#user_id")[0].innerHTML;
    const listing_id = $("#listing_id")[0].innerHTML;
    const favoriteKeys = {user_id, listing_id};

    $.post('/favorites', favoriteKeys, (response) => {
      console.log("AJAX post went through");
    })

  });


});
