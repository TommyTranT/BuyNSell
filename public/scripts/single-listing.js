$(document).ready(function() {

  const writeMessage = $('#write-message');
  const confirmSend = $('#message-sent');
  const favoriteAdded = $('#favorite-added');

  //message seller dropdown
  $('#message-dropdown').click(function(event) {
    event.preventDefault();
    //const error = $('#error-banner');
    const displayStatus = writeMessage.css('display');
    if (displayStatus === 'none') {
      confirmSend.css('display', 'none');
      writeMessage.slideDown({duration: 500});
    } else if (displayStatus === 'block') {
      //error.slideUp({duration: 500});
      writeMessage.slideUp({duration: 500});
    }
  });


  $(".add-favorite").click(function(){
    //display confirmation message
    writeMessage.slideUp({duration: 500});
    favoriteAdded.css('display', 'block');
    $(this).css('animation-play-state', 'running');

    // Gets key of the user
    const user_id = $("#user_id")[0].innerHTML;

    // Gets key of the listing
    const listing_id = $("#listing_id")[0].innerHTML;


    console.log(user_id, listing_id)
    const favoriteKeys = {user_id, listing_id};

    $.post('/favorites', favoriteKeys, (response) => {
      console.log("AJAX post went through");
    })

  });

  $("#send-message").click(function(event){
    event.preventDefault();
    const hiddenValues = $(this).next()[0].innerHTML;
    const messageContents = $(this).prev().val();
    const owner_id = hiddenValues[0];
    const listing_id = hiddenValues[1];

    //display confirmation message
    writeMessage.slideUp({duration: 500});
    confirmSend.css('display', 'block');

    $.post(`/listings/${owner_id}/${listing_id}`, messageContents, (response) => {
    })

  });

});
