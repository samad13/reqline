// services/reqlineService.js
const ReqlineParser = require('../models/ReqlineParser');

const parseReqline = (reqlineStatement) => {
  const parser = new ReqlineParser(reqlineStatement);
  return parser.parse();
};

const validateSyntax = (reqlineStatement) => {
  try {
    parseReqline(reqlineStatement);
    return { isValid: true, errors: [] };
  } catch (error) {
    return { isValid: false, errors: [error.message] };
  }
};

module.exports = {
  parseReqline,
  validateSyntax
};