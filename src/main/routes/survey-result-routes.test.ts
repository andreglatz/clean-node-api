import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'
import { AddSurveyParams } from '@/domain/usercases/survey/add-survey'

let accountCollection: Collection
let surveyCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const accountFake = {
    name: 'André',
    email: 'andre.glatz@gmail.com',
    password: '123'
  }

  const account = await accountCollection.insertOne(accountFake)
  const id = account.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
  return accessToken
}

const mockInsertSurvey = async (): Promise<string> => {
  const surveyFake: AddSurveyParams = {
    question: 'Question',
    answers: [
      {
        answer: 'answer 1',
        image: 'http://image-name.com'
      },
      {
        answer: 'answer 2'
      }
    ],
    date: new Date()
  }

  const survey = await surveyCollection.insertOne(surveyFake)
  const surveyId = survey.ops[0]._id
  return surveyId
}

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      const surveyResultRequest = { answer: 'any_answer' }

      await request(app)
        .put('/api/surveys/any_id/results')
        .send(surveyResultRequest)
        .expect(403)
    })

    test('Should return 200 on save survey with valid accessToken', async () => {
      const accessToken = await mockAccessToken()
      const surveyId = await mockInsertSurvey()

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({ answer: 'answer 1' })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on laod survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })
  })
})
