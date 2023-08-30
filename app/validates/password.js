const util = require('util')
const notify = require(__path_configs + 'notify')

const option = {
    password: {min: 5, max: 20}, 
}


module.exports = {
    validator: (req)=>{
        req.checkBody("password", util.format(notify.ERROR_DESCRIP,option.password.min,option.password.max))
                                    .isLength({ min: option.password.min, max: option.password.max })
        const errors = req.validationErrors() !== false ? req.validationErrors() : [] ;
        let message = {}
        errors.map((val,ind)=>{
            message[val.param] = val.msg
        })
        return message
    }
}