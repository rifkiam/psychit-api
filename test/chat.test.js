import request from 'supertest'
import app from '@/app'

let globalSessionId = '';

describe('POST /chat/start', () => {
  it('should respond with 200 and correct message if authenticated and valid body is provided', async () => {
    const response = await request(app)
      .post('/chat/start')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJyaWZraS5haG1hZDIwMDNAZ21haWwuY29tIiwiaWF0IjoxNzMxNTA3NzQ2LCJleHAiOjE3NjMwNjUzNDZ9.QBYTB6HZfTZjuO9lCD8LqbBt539sdz3wWKYNiuHPGDU') // Set the auth token
      .send({ model: 'psychIT', stream: true }); // Send JSON body

    globalSessionId = response.body.sessionId;

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      message: 'New chat session started',
      sessionId: expect.any(String), // Expecting sessionId to be a string
    });
  });

  it('should respond with 403 if no auth token is provided', async () => {
    const response = await request(app)
      .post('/chat/start')
      .send({ data: 'psychIT', stream: true });

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({ message: 'Not authenticated!' });
  });

  it('should respond with 400 if no data is provided in body', async () => {
    const response = await request(app)
      .post('/chat/start')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJyaWZraS5haG1hZDIwMDNAZ21haWwuY29tIiwiaWF0IjoxNzMxNTA3NzQ2LCJleHAiOjE3NjMwNjUzNDZ9.QBYTB6HZfTZjuO9lCD8LqbBt539sdz3wWKYNiuHPGDU') // Set the auth token
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Model is a required field.' });
  });
});

describe('POST /chat', () => {
  it('should respond with 200 and correct message if authenticated and valid body is provided', async () => {
    const response = await request(app)
      .post('/chat')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJyaWZraS5haG1hZDIwMDNAZ21haWwuY29tIiwiaWF0IjoxNzMxNTA3NzQ2LCJleHAiOjE3NjMwNjUzNDZ9.QBYTB6HZfTZjuO9lCD8LqbBt539sdz3wWKYNiuHPGDU') // Set the auth token
      .send({ model: 'psychIT', stream: true, sessionId: globalSessionId, messages: { "role": "user", "content": "apa kabar?" } });

    expect(response.statusCode).toBe(200);
    expect(response.body.model).toEqual('psychIT');
    expect(response.body.messages).toEqual(expect.arrayContaining([
      expect.objectContaining({
        content: expect.any(String),
        role: expect.any(String)
      })
    ]));
  });

  it('should respond with 403 if no auth token is provided', async () => {
    const response = await request(app)
      .post('/chat')
      .send({});

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({ message: 'Not authenticated!' });
  });

  it('should respond with 400 if no data is provided in body', async () => {
    const response = await request(app)
      .post('/chat')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJyaWZraS5haG1hZDIwMDNAZ21haWwuY29tIiwiaWF0IjoxNzMxNTA3NzQ2LCJleHAiOjE3NjMwNjUzNDZ9.QBYTB6HZfTZjuO9lCD8LqbBt539sdz3wWKYNiuHPGDU') // Set the auth token
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Session ID and messages are required, and messages must be a non-empty array.' });
  });
});

describe('GET /chat', () => {
  it('should respond with 200 and correct message if authenticated and valid body is provided', async () => {
    const response = await request(app)
      .get('/chat')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJyaWZraS5haG1hZDIwMDNAZ21haWwuY29tIiwiaWF0IjoxNzMxNTA3NzQ2LCJleHAiOjE3NjMwNjUzNDZ9.QBYTB6HZfTZjuO9lCD8LqbBt539sdz3wWKYNiuHPGDU');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        userId: expect.any(Number),
        sessionId: expect.any(String),
        model: "psychIT",
        messages: expect.any(Array),
        stream: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null
      })
    ]));
  });

  it('should respond with 403 if no auth token is provided', async () => {
    const response = await request(app)
      .get('/chat')

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({ message: 'Not authenticated!' });
  });

});
