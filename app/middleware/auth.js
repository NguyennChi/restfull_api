
const asyncHandler = require("./async")
const errorResponse = require(__path_utils + 'errorResponse' )
var jwt = require('jsonwebtoken');
const systemConfig = require(__path_configs + 'system')
const MainModel = require(__path_models + 'user')

exports.protect = asyncHandler (async(req, res, next) => {
    console.log(req.cookies.token);
    let token = ''
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if(req.cookies.token){token = req.cookies.token}
    
    if (!token) return next(new errorResponse(401, 'Vui lòng đăng nhập tài khoản'))
    try {
        const decoded = jwt.verify(token,systemConfig.JWT_SECRET)
        req.user = await MainModel.listItem({id:decoded.id}, {task: 'one'} )
        next()
    } catch (error) {
       return next(new errorResponse(401, 'Vui lòng đăng nhập tài khoản'))
    }
})
    
exports.authouize = (...roles) =>{
    return (req, res, next) =>{
        if (!roles.includes(req.user.role)) {
        return next(new errorResponse(403, 'Bạn không có quyền truy cập'))
        }
        next();
    }
}