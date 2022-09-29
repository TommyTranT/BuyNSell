$(document).ready(function() {

  // delete button will change listings.is_removed = true
  $(".delete-button").click(function(){
    console.log("Delete Button functional")

    // Returns listing id value
    const listingKey = $(this).next()[0].innerHTML;

    console.log('Listing ID', listingKey)

    $.post('/delete', {listingKey}, (response) => {
      console.log("AJAX post went through");
      console.log('response:', response);
      location.reload();
    })
  });

  // mark sold button will change listings.is_removed = true
  $(".mark-sold").click(function(){
    console.log("Mark sold button functional")

    // Returns listing id value
    const listingKey = $(this).next()[0].innerHTML;

    console.log('Listing ID', listingKey)

    $.post('/mark_sold', {listingKey}, (response) => {
      console.log("AJAX post went through");
      console.log('response:', response);
      location.reload();
    })
  });


});// END of Doc Ready
