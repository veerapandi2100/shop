/************************************************************************************************
 *	Filename	: order.js							
 *	Author		: Veerapandi M
 *	Date		: 12-10-2021							
 *	Description	: Order create update canecl.
 ***********************************************************************************************/
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const orderdata = require('../models/order');
const productdata = require('../models/product');
const logger = require('../config/logfile');

// Order Create
router.post('/create', (req, res) => {
 //   console.log('inside-order-->', req.body)

    const schema = Joi.object().keys({
        productId : Joi.number().required(),
        productQuantity : Joi.number().required(),
        address : Joi.string().required(),
        paymentMode: Joi.string()
    })
    // validate
    Joi.validate(req.body, schema, async (err, result) => {
        if(err) {
            logger.error(err.details[0].message);
            return res.status(503).send({status: 0, message: err.details[0].message});
        }
        //
         await productdata.findOne({
            product_id : result.productId,
        }).then((data) => {             
            const productData = data.dataValues;
            const amount = (data.product_price * result.productQuantity);
         //   console.log('=====>', amount, result.productQuantity, req.userId);        
         orderdata.create({
            product_id: productData.product_id,
            product_name: productData.product_name,
            customer_id: req.userId,
            quantity: result.productQuantity,
            total_price: amount,
            address: result.address,
            product_unicode: productData.product_unicode,
            
        }).then((data) => {       
            logger.info("Order Created successfully");      
            return res.status(200).send({status: 1, message: "Order Created successfully"});
        }).catch(function(err) {
            // print the error details
            logger.error('error', err);
        });
    });   
    });
})

// order create update cance api
router.post('/update_cancel', (req, res) => {
 //   console.log('inside-order-->', req.body)

    const schema = Joi.object().keys({
        orderId : Joi.number().required(),
        productId : Joi.number().required(),
        productQuantity : Joi.number().required(),
        address : Joi.string().required(),
        orderStatus : Joi.number().required()
    });
    // Validate
    Joi.validate(req.body, schema, async (err, result) => {
        if(err) {
            logger.error(err.details[0].message);
            return res.status(503).send({status: 0, message: err.details[0].message});
        }
        //
         await productdata.findOne({
            product_id : result.productId,
        }).then((data) => {             
            const productData = data.dataValues;
            const amount = (data.product_price * result.productQuantity);
             //  console.log('=====>', amount, result.productQuantity);
        
         orderdata.update({
            product_id: productData.product_id,
            customer_id: req.userId,
            quantity: result.productQuantity,
            total_price: amount,
            address: result.address,
            product_unicode: productData.product_unicode,
            order_status: result.orderStatus},  // 0-submit, 1-inProgress, 2-cancel, 3-success
            {where : {order_id: result.orderId}
        }).then((data) => {            
            return res.status(200).send({status: 1, message: "Order Upated successfully"});
        }).catch(function(err) {
            // print the error details
            logger.error("error", err);  
        });
    });   
    });
})

module.exports = router;