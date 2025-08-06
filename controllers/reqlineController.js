
const reqlineService = require('../services/reqlineService');
const httpService = require('../services/httpService');

const processReqline = async (req, res) => {
  try {
    const { reqline } = req.body;
    
    // Parse the reqline statement
    const parsedRequest = reqlineService.parseReqline(reqline);
    
    // Execute the HTTP request
    const result = await httpService.executeRequest(parsedRequest);
    
    res.status(200).json(result);
    
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message
    });
  }
};

const healthCheck = (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'reqline-parser',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  processReqline,
  healthCheck
};