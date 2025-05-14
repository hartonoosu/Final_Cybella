// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // MongoDB connection
// const connectToDatabase = async () => {
//   if (mongoose.connection.readyState >= 1) return;
  
//   return mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
// };

// // User model schema
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   fullName: { type: String }
// });

// // Initialize the model
// const User = mongoose.models.User || mongoose.model('User', userSchema);

// exports.handler = async (event) => {
//   // Only allow POST requests
//   if (event.httpMethod !== 'POST') {
//     return {
//       statusCode: 405,
//       body: JSON.stringify({ message: 'Method Not Allowed' })
//     };
//   }

//   try {
//     // Parse request body
//     const { email, password } = JSON.parse(event.body);

//     // Connect to database
//     await connectToDatabase();

//     // Find user by email
//     const user = await User.findOne({ email });

//     // If user doesn't exist or password doesn't match
//     if (!user) {
//       return {
//         statusCode: 401,
//         body: JSON.stringify({ message: 'Invalid credentials' })
//       };
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return {
//         statusCode: 401,
//         body: JSON.stringify({ message: 'Invalid credentials' })
//       };
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id.toString() },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     // Return success response
//     // return {
//     //   statusCode: 200,
//     //   body: JSON.stringify({
//     //     token,
//     //     user: {
//     //       id: user._id.toString(),
//     //       email: user.email,
//     //       name: user.fullName
//     //     }
//     //   })
//     // };
//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         token, // your generated JWT or session token
//         user: {
//           id: existingUser._id,
//           email: existingUser.email,
//           fullName: existingUser.fullName,
//           gender: existingUser.gender,
//           dateOfBirth: existingUser.dateOfBirth,
//           ageRange: existingUser.ageRange,
//           aiName: existingUser.aiName,
//           emailVerified: existingUser.emailVerified
//         }
//       })
//     };
    
//   } catch (error) {
//     console.error("Login Error:", error.message, error.stack);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: "Internal Server Error during login" }),
//     };
//   }
// };

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: String,
  gender: String,
  dateOfBirth: String,
  ageRange: String,
  aiName: String,
  emailVerified: { type: Boolean, default: false }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

exports.handler = async (event) => {

//---- Dummy auth for testing purposes ---// 
// const user = await User.findOne({ email });

// if (!user) {
//   // 🔹 Check if this is the dummy email
//   if (email === 'dummy@example.com') {
//     const hashedPassword = await bcrypt.hash('test1234', 10);
//     const dummy = new User({
//       email: "dummy@example.com",
//       password: hashedPassword,
//       fullName: "Dummy User",
//       gender: "Other",
//       dateOfBirth: "2000-01-01",
//       ageRange: "18-25",
//       aiName: "Cybella",
//       emailVerified: true
//     });
//     await dummy.save();
//     console.log("Dummy user auto-created.");
//   } else {
//     return {
//       statusCode: 401,
//       body: JSON.stringify({ message: 'Invalid credentials' }),
//     };
//   }
// }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          ageRange: user.ageRange,
          aiName: user.aiName,
          emailVerified: user.emailVerified
        }
      }),
    };
  } catch (error) {
    console.error("Login Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error during login" }),
    };
  }
};
