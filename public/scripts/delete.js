$(document).ready(function() {

  $(".delete-button").click(function(){
    alert("You've clicked my heart");
    console.log("ITS WORKINGS")

    const listingKey = $(this).next()[0].innerHTML;



    console.log('DELETE THIS KEY', listingKey)

    // import function from index.js
    // databaseFn.addFavorite({user_id, listing_id})
    // const listingKeys = {user_id, listing_id};

    $.post('/listings/delete', {listingKey}, (response) => {
      console.log("AJAX post went through");
    })

  });
});// END of Doc Ready
