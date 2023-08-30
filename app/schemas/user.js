const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');
const {Schema} = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const systemConfig = require(__path_configs + 'system')
const notify = require(__path_configs + 'notify')
const crypto = require('crypto')

var schema = new mongoose.Schema({ 
    username: String,
	email : String,
	role: String,
	password: String,
	resetPassToken: String,
	resetPassTokenExp: String
});
schema.pre('save', function(next){
	if (!this.isModified('password')) {
		next();
	}
	const salt = bcrypt.genSaltSync(10);
	this.password = bcrypt.hashSync(this.password, salt);
	next()
})

schema.methods.updateNew = async function (userNew){ //document
	const isMatch = await bcrypt.compare(userNew.password, this.password)
	if (!isMatch) {
		const salt = bcrypt.genSaltSync(10);
		userNew.password = bcrypt.hashSync(userNew.password, salt);
	} else {
		userNew.password = this.password
	}
	
	return userNew
}

schema.methods.getSignedJwtToken = function (){ //document
	return jwt.sign({ id: this.id }, systemConfig.JWT_SECRET, { expiresIn: systemConfig.JWT_EXP })
}

schema.methods.resetPassword = function (){ //document
	const resetToken = crypto.randomBytes(20).toString('hex')
	this.resetPassToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex')
	this.resetPassTokenExp = Date.now() + 10*60*1000
	return resetToken
}


schema.statics.findByCredentials = async function (email,password){
	let err = ''
	//check empty
	if (!email || !password) return {  err:notify.ERROR_EMPLY}
	//check email
	const user = await this.findOne({email: email})
	if (!user) return {  err: notify.ERROR_LOGIN}
	// check password
	const isMatch = await bcrypt.compare(password, user.password)
	if (!isMatch) return {  err: notify.ERROR_LOGIN}
	return {user}
}

module.exports = mongoose.model(databaseConfig.col_user, schema );