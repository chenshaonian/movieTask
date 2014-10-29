var mongoose = require('mongoose');
var MD5 = require('MD5');
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:{
		unique:true,
		type:String
	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updataAt:{
			type:Date,
			default:Date.now()
		}
	}
});

UserSchema.pre('save', function(next){
	var me = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
		}else {
			this.meta.updateAt = Date.now();
		}
		// bcrypt.genSalt(SALT_WORK_FACTOR,function(err, salt){
		// 	if(err) return next(err);
		// 	bcrypt.hash(me.password, salt, function(err, hash){
		// 		if(err) return next(err);
		// 		me.password = hash;
		// 		next();
		// 	})
		// })
		me.password = MD5(me.password);
		next();
});

UserSchema.methods = {
	comparePassword :function(password, cb){
		if(MD5(password) == this.password)
			{
				return	cb(null, true);
			}else{
				return cb(null, false);;
			}
		
	}
}
UserSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	findByName: function(username, cb){
		var me = this, password;
		return me
		.findOne({name: username})
		.exec(cb);
	}
}
module.exports = UserSchema;