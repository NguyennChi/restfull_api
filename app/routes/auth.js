var express         = require('express');
var router          = express.Router();
const asyncHandler  = require('./../middleware/async')
var validator       = require('express-validator');

const mainValidate  = require(__path_validates + 'password')
const errorResponse = require('./../utils/errorResponse')
const controllerName = 'auth';
const MainModel = require(__path_models + controllerName)

const system = require(__path_configs + 'system')

const {protect,authouize} = require('./../middleware/auth')

router.post('/register', asyncHandler(async (req, res, next) => {
       let errors = await validatorReq(req, res, next) // err
        if (!errors) {   
            const token = await MainModel.create(req.body)
            if (token) {
                saveCookieRes(res,200,token)
            }
        }  
}))

router.post('/login', asyncHandler(async (req, res, next) => {
    const token = await MainModel.login(req.body,res)
    if (token) {
        saveCookieRes(res,200,token)
    }
}))

router.get('/me',protect, asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
}))

router.post('/forgetPassword', asyncHandler(async (req, res, next) => {
   const result = await MainModel.forgetPassword(req.body)
   if (!result) res.status(401).json({success: true,message: 'Email không tồn tại!'})
   res.status(200).json({
    success: true,
    data: result
})
}))

router.post('/resetPassword/:resetToken', asyncHandler(async (req, res, next) => {
    let errors = await validatorReq(req, res, next) // err
    if (!errors) {   
            const user = await MainModel.resetPassword({resetToken: req.params.resetToken, password:req.body.password})
            if (!user) res.status(401).json({success: true,message: 'Không tồn tại token!'})
            res.status(200).json({
            success: true,
            user
            })
        }
 }))

 router.get('/logout',protect, asyncHandler(async (req, res, next) => {
    res.status(200)
    .cookie('token','none',{
        expires: new Date(Date.now() + 10*1000),
        httpOnly: true
    })
    .json({
        success: true
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

const saveCookieRes = (res,statusCode,token) =>{
    const option = {
        expiresIn: new Date (
            Date.now() + system.COOKIE_EXP*24*60*60*1000
        ),
        httpOnly: true
    }
    res.status(statusCode)
    .cookie('token',token,option )
    .json({
        success: true,
        token
    })
}