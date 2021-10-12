/************************************************************************************************
 *	Filename	: index.js							
 *	Author		: Veerapandi M
 *	Date		  : 12-10-2021							
 *	Description	: Main router file.
 ***********************************************************************************************/
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
//
const middleCheck = require('./middelware/checkMiddleware');
// Generate a log file
const logger = require('./config/logfile');
 // parse application/x-www-form-urlencoded
 app.use(bodyParser.urlencoded({ extended: false })); 
 // parse application/json
 app.use(bodyParser.json());
 const sequelizeOrm = require('./config/database');
 // database connection check
 sequelizeOrm.authenticate().then(() =>
  logger.info('Database is connected..!')).catch(err =>
  logger.error('error is ==>', err));
//

app.get('/', (req, res) => {
  res.send('Hi...!\n This is sample project of order create.');
});

// Routes
app.use('/customer', require('./routes/customer'));
// Using middleware for authentication
app.use(middleCheck)
app.use('/product', require('./routes/product'));
app.use('/order', require('./routes/order'));
app.use('/list', require('./routes/list'));
// Server running notify
app.listen(port, () => {
  logger.info(`app listening port: ${port}`);
 // console.log(`Example app listening at http://localhost:${port}`)
});
