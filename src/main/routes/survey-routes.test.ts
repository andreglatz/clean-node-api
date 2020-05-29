import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

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

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      const surveyRequest = {
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },
          {
            answer: 'Answer 2'
          }
        ]
      }

      await request(app)
        .post('/api/surveys')
        .send(surveyRequest)
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const accountFake = {
        name: 'André',
        email: 'andre.glatz@gmail.com',
        password: '123',
        role: 'admin'
      }

      const account = await accountCollection.insertOne(accountFake)
      const id = account.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })

      const surveyRequest = {
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },
          {
            answer: 'Answer 2'
          }
        ]
      }

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(surveyRequest)
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 on load surveys with valid accessToken', async () => {
      const accountFake = {
        name: 'André',
        email: 'andre.glatz@gmail.com',
        password: '123'
      }

      const account = await accountCollection.insertOne(accountFake)
      const id = account.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })

      const surveysFake = [
        {
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            }
          ],
          date: new Date()
        },
        {
          question: 'other_question',
          answers: [
            {
              image: 'other_image',
              answer: 'other_answer'
            }
          ],
          date: new Date()
        }
      ]

      await surveyCollection.insertMany(surveysFake)

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
