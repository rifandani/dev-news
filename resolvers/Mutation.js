const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
// components
const { APP_SECRET, getUserId } = require('../utils');

// Link Mutations ------------------------------------------------

async function postLink(parent, args, context) {
  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
    },
  });
  return newLink;
}

async function updateLink(parent, args, context) {
  const updatedLink = await context.prisma.link.update({
    where: { id: parseInt(args.id) },
    data: {
      url: args.url,
      description: args.description,
    },
  });
  return updatedLink;
}

async function deleteLink(parent, args, context) {
  const deletedLink = await context.prisma.link.delete({
    where: { id: parseInt(args.id) },
  });
  return deletedLink;
}

async function postLinkAuth(parent, args, context, info) {
  // validation
  if (!validator.isURL(args.url) || validator.isEmpty(args.url)) {
    throw new Error(`Please fill in the URL field correctly`);
  }
  if (
    validator.isEmpty(args.description) ||
    !validator.isLength(args.description, { min: 10, max: 100 })
  ) {
    throw new Error(
      `Please make sure the description field is not empty with min length: 10 & max length: 100`,
    );
  }

  // get user.id dari payload auth headers
  const userId = getUserId(context);

  const newLink = context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: {
        connect: { id: userId }, // nested write => create new link & connect link ke existing user
      },
    },
  });
  context.pubsub.publish('NEW_LINK', newLink); // passing (triggerName, payload)

  return newLink;
}

// Vote Mutations ------------------------------------------------

async function vote(parent, args, context) {
  // get user.id dari payload auth headers
  const userId = getUserId(context);
  const vote = await context.prisma.vote.findOne({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId), // parseInt
        userId: Number(userId),
      },
    },
  });

  // check if vote already exists
  if (Boolean(vote)) {
    throw new Error(`Already voted for ${args.linkId}`);
  }

  const newVote = context.prisma.vote.create({
    data: {
      user: {
        connect: { id: Number(userId) }, // nested write => create new vote & connect vote ke user
      },
      link: {
        connect: { id: Number(args.linkId) }, // nested write => create new vote & connect vote ke link
      },
    },
  });
  context.pubsub.publish('NEW_VOTE', newVote);

  return newVote;
}

// User Mutations ------------------------------------------------

async function deleteUser(parent, args, context) {
  const deletedUser = await context.prisma.user.delete({
    where: { id: parseInt(args.id) },
  });
  return deletedUser;
}

// Auth Mutations ------------------------------------------------

async function signup(parent, args, context, info) {
  // input validation
  if (
    validator.isEmpty(args.name) ||
    !validator.isLength(args.name, { min: 3, max: 30 })
  ) {
    throw new Error(
      `Please make sure the name field is not empty with min length: 10 & max length: 30`,
    );
  }
  if (validator.isEmpty(args.email) || !validator.isEmail(args.email)) {
    throw new Error(`Please fill the email field correctly`);
  }
  if (
    validator.isEmpty(args.password) ||
    !validator.isLength(args.password, { min: 6, max: 30 })
  ) {
    throw new Error(
      `Please make sure the password field is not empty with min length: 6 & max length: 30`,
    );
  }

  // hash password
  const password = await bcrypt.hash(args.password, 10);
  // create new user database dengan hash password, args = name, email
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });
  context.pubsub.publish('NEW_USER', user);

  // create jwt token, dengan payload = user.id
  // const claims = { userId: user.id, userEmail: user.email }
  const token = jwt.sign({ userId: user.id }, APP_SECRET, { expiresIn: '3h' });

  return {
    user,
    token,
  };
}

async function login(parent, args, context, info) {
  // input validation
  if (validator.isEmpty(args.email) || !validator.isEmail(args.email)) {
    throw new Error(`Please fill the email field correctly`);
  }
  if (validator.isEmpty(args.password)) {
    throw new Error(`Please fill the password field correctly`);
  }

  // find user
  const user = await context.prisma.user.findOne({
    where: { email: args.email },
  });
  // check if user exists
  if (!user) {
    throw new Error('No such user found');
  }
  // password validation
  const valid = await bcrypt.compare(args.password, user.password);
  // check if user exists
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET, { expiresIn: '3h' });

  return {
    user,
    token,
  };
}

module.exports = {
  postLink,
  postLinkAuth,
  updateLink,
  deleteLink,
  deleteUser,
  signup,
  login,
  vote,
};
