import { gql } from 'apollo-server-core';

export default gql`
  extend type Query {
    surveys: [Survey!]!
  }

  type Survey {
    id: ID!
    question: String!
    answers: [SurveyAnswer!]!
    date: DateTime!
    didAnswer: Boolean
  }

  type SurveyAnswer {
    answer: String!
    image: String
  }
`;
