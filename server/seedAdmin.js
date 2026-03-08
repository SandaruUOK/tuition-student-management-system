const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');
const fs = require('fs');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ email: 'admin@apex.com' });
    if (adminExists) {
      fs.writeFileSync('seedResult.txt', 'Admin already exists');
      process.exit();
    }

    await User.create({
      name: 'Super Admin',
      email: 'admin@apex.com',
      password: 'admin123',
      role: 'admin',
    });

    fs.writeFileSync('seedResult.txt', 'Success');
    process.exit();
  } catch (error) {
    fs.writeFileSync('seedError.json', JSON.stringify({ message: error.message, errors: error.errors }, null, 2));
    process.exit(1);
  }
};

seedAdmin();
