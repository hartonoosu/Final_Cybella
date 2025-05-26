// exports.handler = async function (event, context) {
//   const { userId, currentPassword, newPassword } = JSON.parse(event.body || "{}");

//   if (!userId || !currentPassword || !newPassword) {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ success: false, message: "Missing required fields." }),
//     };
//   }

//   // TODO: Add logic to verify `currentPassword` and update to `newPassword` in your DB
//   console.log(`🔐 Password change requested for user ${userId}`);

//   // Simulated success response (replace this with real DB update logic)
//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       success: true,
//       message: "Password changed successfully.",
//     }),
//   };
// };


// exports.handler = async function (event) {
//   if (event.httpMethod === "OPTIONS") {
//     return {
//       statusCode: 200,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Headers": "Content-Type",
//         "Access-Control-Allow-Methods": "POST, OPTIONS",
//       },
//       body: "OK",
//     };
//   }

//   if (event.httpMethod !== "POST") {
//     return {
//       statusCode: 405,
//       body: JSON.stringify({ message: "Method Not Allowed" }),
//     };
//   }

//   // Your existing password change logic...
//   return {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*", // Or restrict to specific origin
//     },
//     body: JSON.stringify({ success: true, message: "Password changed" }),
//   };
// };

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// User Schema (same as login/register)
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

exports.handler = async function (event) {
  // ✅ CORS preflight support
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "OK",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const { userId, currentPassword, newPassword } = JSON.parse(event.body);
    if (!userId || !currentPassword || !newPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing fields" }),
      };
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: "User not found" }),
      };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: "Incorrect current password" }),
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: true, message: "Password changed successfully" }),
    };
  } catch (error) {
    console.error("Password change error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Error changing password" }),
    };
  }
};
