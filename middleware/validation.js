
const validateReqlineInput = (req, res, next) => {
  const { reqline } = req.body;
  
  if (!reqline) {
    return res.status(400).json({
      error: true,
      message: 'Missing reqline parameter'
    });
  }

  if (typeof reqline !== 'string') {
    return res.status(400).json({
      error: true,
      message: 'Reqline parameter must be a string'
    });
  }

  if (reqline.trim().length === 0) {
    return res.status(400).json({
      error: true,
      message: 'Reqline parameter cannot be empty'
    });
  }

  next();
};

module.exports = {
  validateReqlineInput
};