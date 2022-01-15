export default {
	mongoUrl:
		process.env.MONGO_URL ||
		'mongodb+srv://tdd-mongo:tddMongo@tdd-application.cfjbb.mongodb.net/tdd-application',
	port: process.env.PORT || 3333,
};
