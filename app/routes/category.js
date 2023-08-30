var express         = require('express');
var router          = express.Router();



const asyncHandler  = require('./../middleware/async')
var validator       = require('express-validator');

const controllerName = 'category';
const mainValidate  = require(__path_validates + controllerName)
const errorResponse = require('./../utils/errorResponse')

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
        const data = await MainModel.listItem({'id':req.params.id, 'query':req.query},{'task': 'getProduct'})
        res.status(200).json({
            success: true,
            count: data.length,
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

router.put('/event/:type/:id',asyncHandler( async (req, res, next) => {
    const data = await MainModel.event({'id':req.params.id, 'type': req.params.type})
    if (!data) {
      return  res.status(200).json({
            success: true,
            data: 'Sai trạng thái cập nhật'
        })
    }
    res.status(200).json({
        success: true,
        data: data
    })
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
    if (Object.keys(errors).length >  0) {
        next(new errorResponse(400,errors))
        return true
    }
    return false
}

