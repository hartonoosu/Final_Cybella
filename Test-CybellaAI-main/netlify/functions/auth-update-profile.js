const mongoose = require('mongoose');

// MongoDB connection
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// User schema definition
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: String,
  gender: String,
  dateOfBirth: String,
  ageRange: String,
  aiName: String,
  emailVerified: { type: Boolean, default: false },
});

// User model
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Lambda handler
exports.handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    await connectToDatabase();
    const { userId, updates } = JSON.parse(event.body);

    if (!userId || typeof updates !== 'object') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing userId or updates' }),
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: {
          id: updatedUser._id.toString(),
          email: updatedUser.email,
          fullName: updatedUser.fullName,
          gender: updatedUser.gender,
          dateOfBirth: updatedUser.dateOfBirth,
          ageRange: updatedUser.ageRange,
          aiName: updatedUser.aiName,
          emailVerified: updatedUser.emailVerified,
        },
      }),
    };
  } catch (err) {
    console.error('Profile update error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update profile' }),
    };
  }
};