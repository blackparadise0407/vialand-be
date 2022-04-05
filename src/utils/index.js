const qs = require('qs');

module.exports.getQueryParams = (query) => {
  return qs.parse(query);
};
