import request from 'supertest';
import app from '../config/app';

describe('Body Parser Middleware', () => {
	test('Should parse body as json', async () => {
		app.post('/testBodyParser', (req, res) => {
			res.send(req.body);
		});
		await request(app)
			.post('/testBodyParser')
			.send({ name: 'Robson' })
			.expect({ name: 'Robson' });
	});
});
