import request from 'supertest'
import app from '@/app'

function helper(length) {
  return Math.random().toString(36).substring(2, length + 2);
}

describe('POST /auth/register', () => {
  it('should respond with 200 and provides token and refreshToken', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ firstName: helper(8), lastName: helper(8), email: helper(10) + '@mail.com', password: 'somePassword' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      token: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('should respond with 400 and provides token and refreshToken', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ firstName: helper(8), lastName: helper(8), email: 'rifki.ahmad2003@gmail.com', password: 'somePassword' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      message: 'Sudah ada user dengan email tersebut.',
    });
  });
});

describe('POST /auth/me', () => {
  it('should respond with corresponding user\'s data', async () => {
    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJyaWZraS5haG1hZDIwMDNAZ21haWwuY29tIiwiaWF0IjoxNzMxNTA3NzQ2LCJleHAiOjE3NjMwNjUzNDZ9.QBYTB6HZfTZjuO9lCD8LqbBt539sdz3wWKYNiuHPGDU')

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      id: 2,
      firstName: "Rifqi",
      lastName: "Akhmad",
      email: "rifki.ahmad2003@gmail.com",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null
    });
  })
})

describe('POST /auth/login', () => {
  it('should respond with 200 and provides token and refreshToken', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'rifki.ahmad2003@gmail.com', password: 'Maulana2003' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      token: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('should respond with 400 if email and/or password incorrect', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'rifki.ahmad2003@gmail.com', password: 'NineElevenIsRigged' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      message: 'Password salah!',
    });
  });

  it('should respond with 422 if email and/or password not present', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({});

    expect(response.statusCode).toBe(422);
    expect(response.body).toMatchObject({
      message: 'Validation errors',
      errors: [
        {
          msg: 'Invalid value',
          param: 'password',
          location: 'body'
        },
        {
          msg: 'Invalid value',
          param: 'email',
          location: 'body'
        },
        {
          msg: 'Invalid value',
          param: 'email',
          location: 'body'
        }
      ]
    });
  });
})
