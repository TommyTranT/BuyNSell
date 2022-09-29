$(document).ready(function() {

  $(".delete-button").click(function(){
    alert("You've clicked my heart");
    console.log("ITS WORKINGS")

    const listingKey = $(this).next()[0].innerHTML;



    console.log('DELETE THIS KEY', listingKey)


    // $.post('/listings/delete', {listingKey}, (response) => {
    //   console.log("AJAX post went through");
    // })

    $.ajax('/listings/delete', {
      type: 'POST',
      data: { listingKey },
      success: function (res) {
          console.log('ajax successful!')
      },
      error: function (err) {
          console.log(err);
      }
  });

  });
});// END of Doc Ready
