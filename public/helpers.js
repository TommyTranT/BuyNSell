//accepts array of ALL messages from DB, sorts into nested arrays by listing
const getMessagesByThread = function(messages) {
  let messageThreads = [];
  let listings = [];
  messages.forEach((message) => {
    let listingId = message.listing_id;
    if (!listings.includes(listingId)) {
      listings.push(listingId);
    }
  });
  listings.forEach((id) => {
    let thread = messages.filter(message => message.listing_id === id);
    messageThreads.push(thread);
  })
  console.log(`messageThreads is:`, messageThreads);
  return messageThreads;
};

module.exports = { getMessagesByThread };
