const sequelize  = require('sequelize');
const db = require('../config/database');

const Customer = db.define('customers', {
   
    customer_id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: sequelize.STRING,     
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,    
      },
    password: {
    type: sequelize.STRING,    
    allowNull: false, 
    }
  });

  module.exports = Customer;