import request from 'supertest'
import app from '@/app'

describe('GET /health', () => {
  it('should respond with JSON with success: true', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });
})
