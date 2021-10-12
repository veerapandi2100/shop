/************************************************************************************************
 *	Filename	: customer.js							
 *	Author		: Veerapandi M
 *	Date		: 12-10-2021							
 *	Description	: Customer register and login.
 ***********************************************************************************************/
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const customerdata = require('../models/customer');
const bcrypt = require('bcrypt');
const logger = require('../config/logfile');

// Register Api
router.post('/register', (req, res) => {
    try
    {
  // Validation
    const schema = Joi.object().keys({
        name: Joi.string().trim(),
        email : Joi.string().trim().email().required(),
        password : Joi.string().min(5).max(15).required()
    })
    Joi.validate(req.body, schema, async (err, result) => {
        if(err) {
            logger.error(err.details[0].message);
            return res.status(503).send({status: 0, message: err.details[0].message});
        }
        // Check the mail id is already exist or not
        await customerdata.findOne({ where : { email: result.email}}).then((data) => {
            if(data) {
                logger.error("This email is already exist please login");
                return res.status(200).send({status: 0, message: "This email is already exist please login"});
            } 
        // Encrypt the password     
       bcrypt.hash(result.password, 10, (err, hashData) => {
            customerdata.create({
                name: result.name,
                email: result.email,
                password: hashData
            }).then((data) => {
                let object = {customerId: data.customer_id, name: data.name, email: data.email, password: data.password};
                logger.info("Registered successfully");
                return res.status(200).send({status: 1, message: "Registered successfully", data: object});
            });
        });   
        });
    });
    } catch(e){ logger.error('error', e); }
});

// Login Api
router.post('/login', (req, res) => {
 // 
    const schema = Joi.object().keys({
        email : Joi.string().trim().email().required(),
        password : Joi.string().min(5).max(15).required()
    })
     // Validation
    Joi.validate(req.body, schema, (err, result) => {
        if(err) {
             logger.error(err.details[0].message);
             return res.status(503).send({status: 0, message: err.details[0].message});
        }
        // Validate a email id is exist or not
        customerdata.findOne({ where : { email: result.email}}).then((data) => {
            if(data) {
                // Decrypt password
                 bcrypt.compare(result.password, data.dataValues.password, function(err, result) {
                    if (err) {
                        logger.error(err);
                    }
                  //  console.log('Hey===>', result)
                    if(result === true) {
                        const tokenvalue = jwt.sign({
                            data: data.dataValues.customer_id,
                          }, 'abc321', { expiresIn: 50 * 60 }); // 50 min valid  
                          logger.info("Loggedin successful");                      
                        return res.status(200).send({status: 1, message: "Loggedin successful", token: tokenvalue});
                    }
                    logger.error("Invalid Credentials in Password");
                    return res.status(200).send({status: 0, message: "Invalid Credentials in Password"});                    
                });                
            } else {
                logger.error("Invalid Credentials");
                return res.status(200).send({status: 0, message: "Invalid Credentials"});
            }
        });
    });   
});
module.exports = router;