const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const reqlineRoutes = require('./routes/reqlineRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();


app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/', reqlineRoutes);


app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Reqline parser server running on port ${PORT}`);
});

module.exports = app;