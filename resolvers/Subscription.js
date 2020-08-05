// newLink Subs ------------------------------------------------

function newLinkSubscribe(parent, args, context, info) {
  // asyncIterator(triggerName) => used by GraphQL server to push the event data to the client
  return context.pubsub.asyncIterator('NEW_LINK');
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => payload, // returns the data from the data emitted by the AsyncIterator
};

// newVote Subs ------------------------------------------------

function newVoteSubscribe(parent, args, context, info) {
  return context.pubsub.asyncIterator('NEW_VOTE');
}

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: (payload) => payload,
};

// newUser Subs ------------------------------------------------

function newUserSubscribe(parent, args, context, info) {
  return context.pubsub.asyncIterator('NEW_USER');
}

const newUser = {
  subscribe: newUserSubscribe,
  resolve: (payload) => payload,
};

module.exports = {
  newLink,
  newVote,
  newUser,
};
