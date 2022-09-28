// const databaseFn = require('./db/index.js');
// const databaseFn = require('/db/index.js')

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


  $(".add-favorite").click(function(){
    alert("You've clicked my heart");

    // Gets key of the user
    const user_id = $("#user_id")[0].innerHTML;

    // Gets key of the listing
    const listing_id = $("#listing_id")[0].innerHTML;


    console.log(user_id, listing_id)
    // import function from index.js
    // databaseFn.addFavorite({user_id, listing_id})
    const favoriteKeys = {user_id, listing_id};

    $.post('/favorites', favoriteKeys, (response) => {
      console.log("AJAX post went through");
    })

  });

});
