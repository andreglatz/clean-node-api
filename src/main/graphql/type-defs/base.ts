import { gql } from 'apollo-server-core';

export default gql`
  scalar DateTime

  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;
