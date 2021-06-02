import { gql } from 'apollo-server-core';

export default gql`
  extend type Query {
    surveyResult(surveyId: String!): SurveyResult! @auth
  }

  extend type Mutation {
    saveSurveyResult(surveyId: String!, answer: String!): SurveyResult! @auth
  }

  type SurveyResult {
    surveyId: String!
    question: String!
    answers: [Answer!]!
    date: DateTime!
  }

  type Answer {
    image: String
    answer: String!
    count: Int!
    percent: Float!
    isCurrentAccountAnswer: Boolean!
  }
`;
