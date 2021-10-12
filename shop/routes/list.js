/************************************************************************************************
 *	Filename	: list.js							
 *	Author		: Veerapandi M
 *	Date		: 12-10-2021							
 *	Description	: List the details.
 ***********************************************************************************************/
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const orderdata = require('../models/order');
const db = require('../config/database');
const logger = require('../config/logfile');
const productdata = require('../models/product');

// Order list api
router.get('/order_list', (req, res) => {
  //  console.log('user==>', req.userId);
    const limitData = +req.query.limit ? +req.query.limit: null;
    const offsetData = +req.query.offset ? +req.query.offset: null;
    const sort = (req.query.sort == 1) ?  'DESC': 'ASC'; 
    const search = req.query.search;
  //  console.log('user==>',limitData, offsetData);
    orderdata.findAll({where : {customer_id : req.userId, product_name: {[Op.like]: `%${search}%`} }, order: [['order_id', sort]], offset: offsetData, limit: limitData }).then((result) => { 
        const output = result.map((data) => {
            const objectData = {};
            objectData.orderId = data.order_id,
            objectData.productId = data.product_id;
            objectData.productName = data.product_name;
            objectData.quantity = data.quantity;
            objectData.totalPrice = data.total_price;
            objectData.address = data.address;
            objectData.customerId = data.customer_id;
            objectData.orderDate = data.order_date;
            return objectData;
        });
           logger.info("Customer order list show successfully"); 
           return res.status(200).send({status: 1, message: "Customer order list show successfully", data: output});            
        }).catch(function(err) {
            // print the error details
            logger.error("error", err);
        });
})

// Ordered Product Count API
router.get('/ordered_product_count',  (req, res) => {
    try{
    //  console.log('user==>', req.userId);  
        db.query('SELECT order_id, customer_id, product_name, date(order_date) As order_date , COUNT(order_id) AS order_count , SUM(quantity) AS product_count FROM orders GROUP BY date(order_date)').then(results => {
            logger.info("Successfully show a ordered product list");
            return res.status(200).send({status: 1, message: "Successfully show a ordered product list", data: results[0]});
        }); 
    } catch (e) { logger.error('error', e); }    
});

// Customer Ordered Product Count API
router.get('/customer_ordered_product_count',  (req, res) => {
    try{
    const userId = +req.userId;
        db.query("SELECT order_id, customer_id, product_name, SUM(quantity) AS product_count, date(order_date) As order_date FROM orders WHERE customer_id = "+ userId + " GROUP BY date(order_date)").then(results => {
            logger.info("Successfully show");
            return res.status(200).send({status: 1, message: "Successfully show a customer ordered product list", data: results[0]});
        });
    } catch (e) { logger.error('error', e); } 
});

module.exports = router;