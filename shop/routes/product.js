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



module.exports = router;