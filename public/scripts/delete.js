$(document).ready(function() {

  $(".delete-button").click(function(){
    console.log("ITS WORKINGS")

    // Returns listing id value
    const listingKey = $(this).next()[0].innerHTML;

    console.log('DELETE THIS KEY', listingKey)

    $.post('/delete', {listingKey}, (response) => {
      console.log("AJAX post went through");
      console.log('response:', response);
      location.reload();
    })

  });
});// END of Doc Ready
