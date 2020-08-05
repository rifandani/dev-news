// Link Query ------------------------------------------------

function links(parent, args, context) {
  return context.prisma.link.findMany();
}

function link(parent, args, context) {
  return context.prisma.link.findOne({
    where: { id: parseInt(args.id) },
  });
}

async function feed(parent, args, context) {
  // return the Link elements where the url or the description contain that filter string
  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.filter } },
        ],
      }
    : {};

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  });

  const count = await context.prisma.link.count({ where });

  return {
    links,
    count,
  };
}

// User Query ------------------------------------------------

function users(parent, args, context) {
  return context.prisma.user.findMany();
}

function user(parent, args, context) {
  return context.prisma.user.findOne({
    where: { id: parseInt(args.id) },
  });
}

// Vote Query ------------------------------------------------

function votes(parent, args, context) {
  return context.prisma.vote.findMany();
}

module.exports = {
  links,
  link,
  users,
  user,
  votes,
  feed,
};
