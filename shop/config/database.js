
/************************************************************************************************
 *	Filename	: database.js							
 *	Author		: Veerapandi M
 *	Date		: 12-10-2021							
 *	Description	: Database connection.
 ***********************************************************************************************/
const {Sequelize} = require('sequelize');

module.exports = new Sequelize('shop', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
  });