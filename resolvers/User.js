function links(parent, args, context, info) {
  return context.prisma.user
    .findOne({
      where: { id: parent.id },
    })
    .links();
}

module.exports = {
  links,
};
