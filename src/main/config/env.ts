export default {
	mongoUrl:
		process.env.MONGO_URL ||
		'mongodb+srv://tdd-mongo:tddMongo@tdd-application.cfjbb.mongodb.net/tdd-application',
	port: process.env.PORT || 3000,
	jwtSecret: process.env.JWT_SECRET || '8ee4ca1eca3442a7431efd8de1ebb7ec',
};
