const { verifyToken } = require("./utils/jwt");


exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: 'OK'
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    await connectToDatabase();
    const user = verifyToken(event);
    const sessions = await DashboardSession.find({ userId: user.userId }).sort({ startTime: -1 });

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ success: true, data: sessions })
    };
  } catch (error) {
    console.error('Get dashboard sessions error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ success: false, message: 'Failed to retrieve sessions' })
    };
  }
};