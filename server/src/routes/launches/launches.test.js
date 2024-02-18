const request = require('supertest')
const app = require('../../app')
const { mongoConnect, mongoDisconnect } = require('../../services/mongo')

describe('Lauches API', () => {
  beforeAll(async () => {
    await mongoConnect()
  })

  afterAll(async () => {
    await mongoDisconnect() 
  })

  describe('Test GET /v1/launches', () => {
    test('it should respond with 200 success', async () => {
      await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
  
  describe('Test POST /v1/launches', () => {
    const validLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'January 4, 2028',
    }
  
    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
    }
  
    const launchDataWithInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'zoot', 
    }
  
    test('it should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(validLaunchData)
        .expect('Content-Type', /json/)
        .expect(201)
  
      expect(response.body).toMatchObject(launchDataWithoutDate)
  
      const requestDate = new Date(validLaunchData.launchDate).valueOf()
      const responseDate = new Date(response.body.launchDate).valueOf()
      expect(responseDate).toBe(requestDate)
    })
  
    test('it should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400)
  
      expect(response.body).toStrictEqual({
         error: 'Missing required launch property'
      })
    })
    test('it should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400)
  
      expect(response.body).toStrictEqual({
        error: 'Invalid launch date'
      })
    })
  })
})

