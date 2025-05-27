
const mongoose = require('mongoose');
const { verifyToken } = require("./utils/jwt");

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const dashboardSchema = new mongoose.Schema({
  userId: String, // email
  sessionId: String,
  startTime: Date,
  endTime: Date,
  duration: Number,
  voiceLogs: Array,
  facialLogs: Array,
  summary: Object
});

const DashboardSession = mongoose.models.DashboardSession || mongoose.model('DashboardSession', dashboardSchema);

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: 'OK'
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    await connectToDatabase();
    const user = verifyToken(event); // get email from token
    const data = JSON.parse(event.body);
    
    const session = await DashboardSession.findOneAndUpdate(
      { userId: user.email, sessionId: data.sessionId },
      { $set: { ...data, userId: user.email } },
      { upsert: true, new: true }
    );

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ success: true, data: session })
    };
  } catch (error) {
    console.error('Save dashboard session error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ success: false, message: 'Failed to save session data' })
    };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
}
