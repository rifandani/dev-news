const jwt = require('jsonwebtoken');
const APP_SECRET = 'rifandani';

function getUserId(context) {
  // get from Authorization headers
  const auth = context.request.get('Authorization');
  // check if auth token exists
  if (!auth) {
    throw new Error('Not Authenticated');
  }

  // ambil User JWT token dari Authorization headers
  const token = auth.replace('Bearer ', '');
  // extact payload userId dari token
  const { userId } = jwt.verify(token, APP_SECRET);

  return userId;
}

module.exports = {
  APP_SECRET,
  getUserId,
};
