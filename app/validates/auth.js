const util = require('util')
const notify = require(__path_configs + 'notify')

const option = {
    username: {min: 3, max: 20},
    password: {min: 5, max: 20},
    enum: ['user']
}


module.exports = {
    validator: (req)=>{
        req.checkBody("username", util.format(notify.ERROR_NAME,option.username.min,option.username.max))
                                    .isLength({ min: option.username.min, max: option.username.max })
        req.checkBody("email", util.format(notify.ERROR_EMAIL))
                                    .matches(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
        req.checkBody("role", util.format(notify.ERROR_ROLR))
                                    .isIn(option.enum)
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