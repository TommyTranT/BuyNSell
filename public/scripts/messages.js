$(document).ready(function() {

  //render latest reply (NOT PULLED FROM DB)
  const postReply = function(sender_name, listing_title, message) {
    return `
    <div class="single-container">
      <header>
        <div>${sender_name}</div>
        <div>Listing: ${listing_title}</div>
        <div>just now</div>
      </header>
      <div class="container-lower">
        <div class="avatar">${sender_name[0]}</div>
        <article>
          ${message}
        </article>
        <div></div>
      </div>
    </div>
    `
  }

  //message thread dropdown
  $('.thread-dropdown').click(function() {
    const messageThread = $(this).next()
    const displayStatus = messageThread.css('display');

    if (displayStatus === 'none') {
      messageThread.slideDown({duration: 700});
    } else if (displayStatus === 'block') {
      messageThread.slideUp({duration: 700});
    }
  });

  //create new reply
  $(".reply-button").click(function(event){
    const hiddenValues = $(this).parent().next()[0];
    const hiddenValuesArray = hiddenValues.innerHTML.split(',');
    const threadContainer = $(this).parent().next().next();
    const textarea = $(this).prev();
    const messageContents = $(this).prev().val();
    const owner_id = hiddenValuesArray[0];
    const listing_id = hiddenValuesArray[1];
    const listing_title = hiddenValuesArray[2];
    const sender_name = hiddenValuesArray[3];
    const timeStamp = hiddenValuesArray[4];

    //new reply at top
    const $newPost = postReply(sender_name, listing_title, messageContents);
    $(threadContainer).prepend($newPost);

    //clear field
    $(textarea).val('');

    $.post(`/listings/${owner_id}/${listing_id}`, messageContents, (response) => {
    })

  });

});
