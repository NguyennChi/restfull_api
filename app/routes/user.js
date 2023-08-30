var express         = require('express');
var router          = express.Router();
const asyncHandler  = require('./../middleware/async')
var validator       = require('express-validator');

const mainValidate  = require(__path_validates + 'user')
const errorResponse = require('./../utils/errorResponse')
const controllerName = 'user';
const MainModel = require(__path_models + controllerName)


router.get('/',asyncHandler( async (req, res, next) => {
        const data = await MainModel.listItem(req.query,{'task': 'all'})
        res.status(200).json({
            success: true,
            count: data.length,
            data: data
        })
}))
router.get('/:id',asyncHandler( async (req, res, next) => {
        const data = await MainModel.listItem({'id':req.params.id},{'task': 'one'})
        res.status(200).json({
            success: true,
            data: data
        }) 
}))

router.post('/add', asyncHandler(async (req, res, next) => {

        req.body =JSON.parse(JSON.stringify(req.body))
       let errors = await validatorReq(req, res, next) // err
        if (!errors) {   
            const data = await MainModel.create(req.body)
            res.status(200).json({
                success: true,
                data: data
            })
        }  
}))

router.put('/edit/:id',asyncHandler( async (req, res, next) => {
    let errors = await validatorReq(req, res, next) // err
    if (!errors) {
        const data = await MainModel.editItem({'id':req.params.id, 'body': req.body},{'task': 'edit'})
        res.status(200).json({
            success: true,
            data: data
        })
    }       
}))



router.delete('/delete/:id',asyncHandler( async(req, res, next) => {
        const data = await MainModel.deleteItem({'id':req.params.id},{'task': 'one'})
        res.status(200).json({
            success: true,
            data: data
        })
}))


module.exports = router;

const validatorReq = async (req, res, next) =>{
    const errors = await mainValidate.validator(req) // err
    console.log(errors);
    if (Object.keys(errors).length >  0) {
        next(new errorResponse(400,errors))
        return true
    }
   
    return false
}