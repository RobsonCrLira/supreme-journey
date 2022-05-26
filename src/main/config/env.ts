export default {
	mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/tdd',
	port: process.env.PORT || 3000,
	jwtSecret: process.env.JWT_SECRET || '8ee4ca1eca3442a7431efd8de1ebb7ec',
};
