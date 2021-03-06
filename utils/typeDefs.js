const { gql } = require('apollo-server-lambda');

export const typeDefs = gql`
  # exclamation mark means that this field is REQUIRED and can never be NULL / contains NULL elements inside array

  scalar DateTime

  type Query {
    links: [Link!]!
    link(id: ID!): Link
    users: [User!]!
    user(id: ID!): User
    votes: [Vote!]

    # filter, pagination, sorting => PRISMA takes care the pagination & sorting code (nama argumen nya harus sama persis, karena bawaan dari prisma)
    # The limit is called take, meaning you’re “taking” x elements after a provided start index
    # The start index is called skip, since you’re skipping that many elements in the list before collecting the items to be returned. If skip is not provided, it’s 0 by default. The pagination then always starts from the beginning of the list
    feed(filter: String, skip: Int, take: Int, orderBy: LinkOrderByInput): Feed!
  }

  type Mutation {
    # Link model
    postLink(url: String!, description: String!): Link!
    postLinkAuth(url: String!, description: String!): Link!
    updateLink(id: ID!, url: String, description: String): Link
    deleteLink(id: ID!): Link
    # User model
    deleteUser(id: ID!): User
    # Vote model
    vote(linkId: ID!): Vote
    # AuthPayload model
    signup(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }

  type Subscription {
    newLink: Link
    newVote: Vote
    newUser: User
  }

  type Link {
    id: ID!
    description: String!
    url: String!
    postedBy: User
    votes: [Vote!]!
    createdAt: DateTime!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    links: [Link!]!
  }

  type Vote {
    id: ID!
    link: Link!
    user: User!
  }

  type Feed {
    links: [Link!]!
    count: Int!
  }

  input LinkOrderByInput {
    description: Sort
    url: Sort
    createdAt: Sort
  }

  enum Sort {
    asc
    desc
  }
`;
