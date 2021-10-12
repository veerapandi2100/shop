const sequelize  = require('sequelize');
const db = require('../config/database');

const Product = db.define('products', {
   
    product_id: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    product_name: {
        type: sequelize.STRING,
        allowNull: false,    
    },
    product_image_path: {
        type: sequelize.STRING,   
      },
    product_unicode: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true
    },
    product_quantity: {
        type: sequelize.INTEGER,    
        allowNull: false, 
        },
    product_price: {
        type: sequelize.INTEGER,    
        allowNull: false, 
        }
  });

  module.exports = Product;