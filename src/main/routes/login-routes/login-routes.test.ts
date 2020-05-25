import request from 'supertest'
import app from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    accountCollection.deleteMany({})
  })
  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'André',
          email: 'andre.glatz@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const SALT = 12
      const password = await hash('123', SALT)

      const accountFake = {
        name: 'André',
        email: 'andre.glatz@gmail.com',
        password
      }

      await accountCollection.insertOne(accountFake)

      const accountLogin = {
        email: 'andre.glatz@gmail.com',
        password: '123'
      }

      await request(app)
        .post('/api/login')
        .send(accountLogin)
        .expect(200)
    })
  })
})
