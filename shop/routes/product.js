/************************************************************************************************
 *	Filename	: product.js							
 *	Author		: Veerapandi M
 *	Date		: 12-10-2021							
 *	Description	: Product create update.
 ***********************************************************************************************/
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const productdata = require('../models/product');
const logger = require('../config/logfile');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Product create api
router.post('/create', (req, res) => {
    //
    const schema = Joi.object().keys({
        productName : Joi.string().trim().min(2),
        productImage : Joi.string().trim(),
        productQuantity : Joi.number(),
        productUniqueCode : Joi.string().min(3).max(10).required(),
        productPrice : Joi.number().required(),
    })
    // Validate
    Joi.validate(req.body, schema, (err, result) => {
        if(err) {
            logger.error(err.details[0].message);
            return res.status(503).send({status: 0, message: err.details[0].message});
        }
        // If Image come
        const avatar = result.productImage;
        let type;
        let name = null;
        if(avatar) {
            type = avatar.split(';')[0].split('/')[1];
            name = 'productImage/Image_' + Date.now() + '.' + type;
            const base64Data = new Buffer(avatar.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            require("fs").writeFile(name, base64Data, 'base64', function(err) {
                console.log(err);
            });
        }
        //
          productdata.findOne({where: {product_unicode: result.productUniqueCode}}).then( async (data) => {
          if (data) {
                await productdata.update({
                    product_name: result.productName,
                    product_quantity: result.productQuantity,
                    product_price: result.productPrice,
                    product_image_path: name},
                    {where : {product_id: data.dataValues.product_id}
                }).then((data) => {
                    logger.info("Product Updated successfully");
                    return res.status(200).send({status: 1, message: "Product Updated successfully"});
                })
            } else {
                await productdata.create({
                    product_name: result.productName,
                    product_image_path: name,
                    product_unicode: result.productUniqueCode,
                    product_quantity: result.productQuantity,
                    product_price: result.productPrice,
                }).then((data) => {      
                    logger.info("Product Created successfully"); 
                    return res.status(200).send({status: 1, message: "Product Created successfully"});
                });
            }
        });
    });   
})

// Product list api
router.get('/product_list', (req, res) => {
    //  console.log('user==>', req.userId);
      const limitData = +req.query.limit ? +req.query.limit: null;
      const offsetData = +req.query.offset ? +req.query.offset: null;
      const sort = (req.query.sort == 1) ?  'DESC': 'ASC'; 
      const search = req.query.search;
    //  console.log('user==>',limitData, req.query.search);
    let whereData = {};
    whereData = { product_name: {[Op.like]: `%${search}%`}, order: [['product_id', sort]], offset: offsetData, limit: limitData };
    productdata.findAll(whereData).then((result) => { 
          const output = result.map((data) => {
              const objectData = {};
              objectData.productId = data.product_id;
              objectData.productName = data.product_name;
              objectData.productImagePath = data.product_image_path;
              objectData.productUnicode = data.product_unicode;
              objectData.productQuantity = data.product_quantity;
              objectData.productPrice= data.product_price;
              objectData.createdUserId = data.created_by ? data.created_by : 0;
              objectData.createdDate = data.createdAt;
              return objectData;
          });
             logger.info("Product list show successfully"); 
             return res.status(200).send({status: 1, message: "Product list show successfully", data: output});            
          }).catch(function(err) {
              // print the error details
              logger.error("error", err);
          });
  });

// Get Product product details api
router.get('/get_product', (req, res) => {
    //  console.log('user==>', req.userId);
    const productId = (req.query.productId != "") ? req.query.productId : 0;
    productdata.findByPk(productId).then((result) => {
        if(!result) {
            logger.error("give a valid product id");
            return res.status(503).send({status: 0, message: 'Give a valid product id'});
        }
        const outResult = {};
        outResult.productId = result.product_id;
        outResult.productName = result.product_name;
        outResult.productImagePath = result.product_image_path;
        outResult.productUnicode = result.product_unicode;
        outResult.productQuantity = result.product_quantity;
        outResult.productPrice = result.product_price;
        outResult.createdBy = result.created_by;
        outResult.createdDate = result.createdAt;
        logger.info("Product details show successfully"); 
        return res.status(200).send({status: 1, message: "Product details show successfully", data: outResult});  
    }).catch(function(err) {
        // print the error details
        logger.error("error", err);
    });      
});


module.exports = router;
