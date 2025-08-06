
const errorHandler = (error, req, res, next) => {
  console.error('Error occurred:', error);
  
  res.status(500).json({
    error: true,
    message: 'Internal server error'
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: true,
    message: 'Endpoint not found'
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};