const app = require('../backend/app');

module.exports = async (req, res) => {
  return app(req, res);
};
