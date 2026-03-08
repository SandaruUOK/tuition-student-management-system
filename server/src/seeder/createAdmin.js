const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@apex.com',
      password: '123456',
      role: 'admin',
    });

    console.log('Admin created:', admin.email);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();