// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

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
//   fullName: { type: String },
//   gender: { type: String },
//   dateOfBirth: { type: String },
//   emailVerified: { type: Boolean, default: false }
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
//     const { email, password, fullName, gender, dateOfBirth } = JSON.parse(event.body);

//     // Connect to database
//     await connectToDatabase();

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ message: 'Email already in use' })
//       };
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({
//       email,
//       password: hashedPassword,
//       fullName,
//       gender,
//       dateOfBirth,
//       emailVerified: false
//     });

//     // Save user to database
//     await newUser.save();

//     // Return success response
//     return {
//       statusCode: 201,
//       body: JSON.stringify({
//         success: true,
//         user: {
//           id: newUser._id.toString(),
//           email: newUser.email,
//           name: newUser.fullName,
//           gender: newUser.gender,
//           dateOfBirth: newUser.dateOfBirth,
//           emailVerified: newUser.emailVerified
//         }
//       })
//     };
//   } catch (error) {
//     console.error('Registration error:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Server error during registration' })
//     };
//   }
// };


// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// // MongoDB connection
// const connectToDatabase = async () => {
//   if (mongoose.connection.readyState >= 1) return;
  
//   return mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
// };

// // ✅ User schema updated with ageRange and aiName
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   fullName: { type: String },
//   gender: { type: String },
//   dateOfBirth: { type: String },
//   ageRange: { type: String },       // ✅ added
//   aiName: { type: String },         // ✅ added
//   emailVerified: { type: Boolean, default: false }
// });

// const User = mongoose.models.User || mongoose.model('User', userSchema);

// exports.handler = async (event) => {
//   if (event.httpMethod !== 'POST') {
//     return {
//       statusCode: 405,
//       body: JSON.stringify({ message: 'Method Not Allowed' })
//     };
//   }

//   try {
//     const { email, password, fullName, gender, dateOfBirth, ageRange, aiName } = JSON.parse(event.body);

//     await connectToDatabase();

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ message: 'Email already in use' })
//       };
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       email,
//       password: hashedPassword,
//       fullName,
//       gender,
//       dateOfBirth,
//       ageRange,        // ✅ include in user creation
//       aiName,          // ✅ include in user creation
//       emailVerified: false
//     });

//     await newUser.save();

//     return {
//       statusCode: 201,
//       body: JSON.stringify({
//         success: true,
//         user: {
//           id: newUser._id.toString(),
//           email: newUser.email,
//           name: newUser.fullName,
//           gender: newUser.gender,
//           dateOfBirth: newUser.dateOfBirth,
//           ageRange: newUser.ageRange,
//           aiName: newUser.aiName,
//           emailVerified: newUser.emailVerified
//         }
//       })
//     };
//   } catch (error) {
//     console.error('Registration error:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Server error during registration' })
//     };
//   }
// };


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

// ✅ User schema updated with ageRange and aiName
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  gender: { type: String },
  dateOfBirth: { type: String },
  ageRange: { type: String },
  aiName: { type: String },
  emailVerified: { type: Boolean, default: false }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    const { email, password, fullName, gender, dateOfBirth, ageRange, aiName } = JSON.parse(event.body);

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: 'Email already in use' })
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      gender,
      dateOfBirth,
      ageRange,
      aiName,
      emailVerified: false
    });

    await newUser.save();

    return {
      statusCode: 200, // ✅ change from 201 to 200
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        user: {
          id: newUser._id.toString(),
          email: newUser.email,
          name: newUser.fullName,
          gender: newUser.gender,
          dateOfBirth: newUser.dateOfBirth,
          ageRange: newUser.ageRange,
          aiName: newUser.aiName,
          emailVerified: newUser.emailVerified
        }
      })
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },  // ✅ Added
      body: JSON.stringify({ message: 'Server error during registration' })
    };
  }
};
