import { gql } from 'apollo-server-core';

export default gql`
  extend type Query {
    login(email: String!, password: String!): Account!
  }

  extend type Mutation {
    signup(
      name: String!
      email: String!
      password: String!
      passwordConfirmation: String!
    ): Account!
  }

  type Account {
    accessToken: String!
    name: String!
  }
`;
