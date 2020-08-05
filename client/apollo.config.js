module.exports = {
  client: {
    tagName: 'graphql',
    service: {
      name: 'devnews',
      localSchemaFile: '../schema.graphql',
      // url: 'http://localhost:4000/graphql',
      // headers: {
      //   authorization: 'Bearer lkjfalkfjadkfjeopknavadf',
      // },
    },
    includes: ['./src/**/*.js'],
    excludes: ['**/__tests__/**'],
  },
};
