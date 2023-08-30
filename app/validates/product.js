const util = require('util')
const notify = require(__path_configs + 'notify')

const option = {
    name: {min: 5, max: 50},
    description: {min: 5, max: 500}
}


module.exports = {
    validator: (req)=>{
        req.checkBody("name", util.format(notify.ERROR_NAME,option.name.min,option.name.max))
                                    .isLength({ min: option.name.min, max: option.name.max })
        req.checkBody("description", util.format(notify.ERROR_DESCRIP,option.description.min,option.description.max))
                                    .isLength({ min: option.description.min, max: option.description.max })


        const errors = req.validationErrors() !== false ? req.validationErrors() : [] ;
        let message = {}
        errors.map((val,ind)=>{
            message[val.param] = val.msg
        })
        return message
    }
}