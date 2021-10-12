/************************************************************************************************
 *	Filename	: checkMiddleware.js							
 *	Author		: Veerapandi M
 *	Date		  : 12-10-2021							
 *	Description	: Validate Token using middleware.
 ***********************************************************************************************/
const jwt = require('jsonwebtoken');
const customerdata = require('../models/customer');
const logger = require('../config/logfile');
module.exports = function middleCheck(req,res, next) {
  //  console.log('middle', req.body);
  //  console.log('middle ', req);
    const authorization = req.header('authorization');
    // console.log(authorization);
    // console.log(authorization.split(' ')[0]);
    
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        // console.log('Credentials token');       
        // console.log(authorization.split(' ')[1]);
        const tokenData = authorization.split(' ')[1];
        jwt.verify(tokenData, 'abc321', async function(err, decoded) {
            console.log('Errrrr---------------->', err);
            if (err) {
                logger.error("Not a Vaild", err);
                return res.status(503).send({status: 0, message: 'Not a Vaild'});
            }
                    console.log(decoded);
                    await customerdata.findByPk(decoded.data).then((data) => {
                      //  console.log('Id==>', data.customer_id);
                        if(!data.customer_id) {
                            logger.error("Not a Vaild");
                            return res.status(503).send({status: 0, message: 'Not a Vaild'});
                        }                                       
                    req.userId = data.customer_id;
                    next();
                    })  
          });
    } else {       
            logger.error("No credentials given");
            return res.status(503).send({status: 0, message: 'No credentials given'});
    }
}