// __mocks__/@sendgrid/client.js
const get = require('lodash.get');

module.exports.setApiKey = () => {};

module.exports.request = (data) => {
  const isValid = typeof get(data, ['body', 'content']) !== 'undefined';
  return Promise.resolve([{ statusCode: isValid ? 202 : 400 }]);
}