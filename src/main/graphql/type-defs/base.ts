import { gql } from 'apollo-server-core';

export default gql`
  scalar DateTime

  directive @auth on FIELD_DEFINITION

  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;
