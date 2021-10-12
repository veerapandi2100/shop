const sequelize  = require('sequelize');
const db = require('../config/database');

const Order = db.define('orders', {
   
    order_id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: sequelize.INTEGER,
        allowNull: false,    
    },
    product_name: {
        type: sequelize.STRING,   
        },
    customer_id: {
        type: sequelize.INTEGER,
        allowNull: false,   
      },
    quantity: {
        type: sequelize.INTEGER,
        allowNull: false,
    },
    total_price: {
        type: sequelize.INTEGER,    
        allowNull: false, 
        },
    address: {
        type: sequelize.STRING,    
        allowNull: false, 
        },
    order_status: {
        type: sequelize.INTEGER,    
        },
    order_date: {
        type: sequelize.DATE,
        defaultValue: sequelize.NOW
        },
    product_unicode: {
        type: sequelize.INTEGER,
        allowNull: false, 
    }
        
  });

  module.exports = Order;