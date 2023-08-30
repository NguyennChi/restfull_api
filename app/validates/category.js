const util = require('util')
const notify = require(__path_configs + 'notify')

const option = {
    name: {min: 5, max: 50},
    title: {min: 5, max: 100}
}


module.exports = {
    validator: (req)=>{
        req.checkBody("name", util.format(notify.ERROR_NAME,option.name.min,option.name.max))
                                    .isLength({ min: option.name.min, max: option.name.max })
        req.checkBody("title", util.format(notify.ERROR_DESCRIP,option.title.min,option.title.max))
                                    .isLength({ min: option.title.min, max: option.title.max })


        const errors = req.validationErrors() !== false ? req.validationErrors() : [] ;
        let message = {}
        
            errors.map((val,ind)=>{
                console.log(val);
                message[val.param] = val.msg
            })
            return message
        
        
    }
}


