

const MainModel 	= require(__path_schemas + 'user');
const sendEmail 	= require(__path_utils + 'sendEmail');
const crypto = require('crypto')

module.exports = {

    create: async (items)=>{
        const user = await new MainModel(items).save();
        return await user.getSignedJwtToken()
    },
    login: async (items,res)=>{
        const {email,password} = items
        const result = await MainModel.findByCredentials(email,password)
        if (result.err) {
            res.status(401).json({success: true, message: result.err})
           return false
        }
        return await result.user.getSignedJwtToken()
    },
    forgetPassword:  async (items)=>{
      const user = await MainModel.findOne({email:items.email })
      if (!user) return false
     const resetToken = user.resetPassword()
     await user.save()
      
     //create resetURL
     const resetURL = `/api/v1/auth/resetPassword/${resetToken}`
     const message = `Truy cập vào link để đổi password: ${resetURL}`

     try {
        await sendEmail({
            email: user.email,
            subject: 'Thay đổi Password',
            message
        })
        return 'Vui lòng check email của bạn'
     } catch (error) {
        user.resetPassToken= undefined,
        user.resetPassTokenExp= undefined
        await user.save()
        return ' Không thể gửi email, vui lòng thử lại!'
     }

    },
    resetPassword:  async (items)=>{
        const resetPassToken = crypto
            .createHash('sha256')
            .update(items.resetToken)
            .digest('hex')
            const user = await MainModel.findOne({
                resetPassToken: resetPassToken,
                resetPassTokenExp : {$gt: Date.now()}
             })

	 if (!user) return false
     user.password = items.password,
     user.resetPassToken= undefined,
     user.resetPassTokenExp= undefined,
     await user.save()
        return user
    }

}
