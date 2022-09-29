$(document).ready(function() {

  $(".delete-button").click(function(){
    console.log("ITS WORKINGS")

    // Returns listing id value
    const listingKey = $(this).next()[0].innerHTML;



    console.log('DELETE THIS KEY', listingKey)


    // $.post('/listings/delete', {listingKey}, (response) => {
    //   console.log("AJAX post went through");
    // })

    $.post('/delete', {listingKey}, (response) => {
      console.log("AJAX post went through");
    })

  //   $.ajax('/delete', {
  //     type: 'POST',
  //     data: { listingKey },
  //     success: function (res) {
  //         console.log('ajax successful!')
  //     },
  //     error: function (err) {
  //         console.log(err);
  //     }
  // });



  });
});// END of Doc Ready
