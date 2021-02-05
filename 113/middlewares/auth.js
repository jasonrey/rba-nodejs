const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authorization = req.header('authorization');

  if (!authorization) {
    return res.status(401).json({
      message: 'Missing authorization token',
    });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: err.message,
    });
  }
};
