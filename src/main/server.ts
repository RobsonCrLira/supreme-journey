import { MongoHelper } from '../infra/db/mongodb/helper/mongoHelper';
import 'dotenv/config';
import env from './config/env';

MongoHelper.connect(env.mongoUrl)
	.then(async () => {
		const app = (await import('./config/app')).default;
		app.listen(env.port, () => console.log(`Server run Port: ${env.port}`));
	})
	.catch(console.error);
