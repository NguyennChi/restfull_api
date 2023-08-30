let errorResponse = require('./../utils/errorResponse')

let notify  = require('./../configs/notify')

const errorHandler = (err, req, res, next) => {
    console.log(err.name.yellow);
    let error = err
    if(error.name === 'CastError'){
        let message = notify.ERROR_CASTERROR
        error = new errorResponse(404,message)
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'SERVER ERROR'
    })
   
  }
  
module.exports = errorHandler

