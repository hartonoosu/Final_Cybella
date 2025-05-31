const mongoose = require('mongoose');

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const conversationSchema = new mongoose.Schema({
  userId: String,
  sessionId: String,
  timestamp: { type: Date, default: Date.now },
  messages: [
    {
      from: String, // 'user' or 'ai'
      text: String,
    }
  ],
  type: String // 'voice' or 'text'
});

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

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
    const { userId, sessionId, messages, type } = JSON.parse(event.body);
    const newConversation = await Conversation.create({ userId, sessionId, messages, type });

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ success: true, data: newConversation })
    };
  } catch (error) {
    console.error('Save conversation error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ success: false, message: 'Failed to save conversation' })
    };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
} 