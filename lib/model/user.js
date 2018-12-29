'use strict';

const
	mongoose = require('mongoose'),
	{ Schema } = mongoose,
	hat = require('hat'),
	merge = require('merge'),
	bcrypt = require('bcrypt'),
	jwt = require('jsonwebtoken'),
	util = require('util'),
	moment = require('moment'),
	escapeStringRegexp = require('escape-string-regexp');

const
	{ ApiError } = require('lib/model');

const saltRounds = 10;

const userSchema = new Schema({
	'identifier': { type: String, required: true, default: hat, index: { unique: true } },
	'name': { type: String, required: true },
	'_name_lc': { type: String, required: true, index: true },
	'email': { type: String, required: true },
	'_email_lc': { type: String, required: true, index: { unique: true } },
	'_password': { type: String, required: true }
}, {
	toJSON: {
		transform: function(doc, ret) {
			Object.keys(ret).forEach((key) => {
				if (/^_/.test(key)) delete ret[key];
			});
		}
	}
});

userSchema.pre('validate', async function() {
	if (this.isModified('name')) {
		this._name_lc = this.name.toLowerCase();
	}
	if (this.isModified('email')) {
		this._email_lc = this.email.toLowerCase();
	}
	if (this.isModified('_password')) {
		this._password = await bcrypt.hash(this._password, saltRounds);
	}
});

userSchema.methods.change = async function(update) {
	return await merge(this, update).save();
};

userSchema.methods.delete = async function() {
	await User.deleteOne({ _id: this._id }).exec();
};

userSchema.methods.auth = async function(password) {
	return await bcrypt.compare(password, this._password);
};

userSchema.methods.jwt = async function() {
	return await util.promisify(jwt.sign)({
		iat: moment.utc().toDate().getTime(),
		user: this.identifier
	}, process.env.SECRET || 'notsosecretsecret');
};

userSchema.methods.resetPassword = async function() {
	throw new ApiError('not-implemented', 'Not implemented.', 501);
};

userSchema.methods.equals = function(other) {
	return this._id.equals((other || {})._id || other);
};

let User = module.exports = exports = mongoose.model('user', userSchema);

User.create = async (user) => {
	if (await User.get(user.email)) {
		throw new ApiError('conflict', 'User already exists.', 409);
	}
	return await (new User(user)).save();
};

User.get = async (identifier) => {
	return await User.findOne({ 
		$or: [
			{ 'identifier': identifier},
			{ '_email_lc': identifier.toLowerCase() }
		]
	});
};

User.auth = async (token) => {
	const decoded = await util.promisify(jwt.verify)(token, process.env.SECRET || 'notsosecretsecret');
	return await User.get(decoded.user);
};

User.search = async (query, pagination = {}) => {

	const regexp = new RegExp(escapeStringRegexp(query), 'i');

	query = { 
		$or: [
			{ '_email_lc': { $regex: regexp } },
			{ '_name_lc': { $regex: regexp } }
		]
	};

	return [
		await User
			.find(query)
			.sort({ '_name_lc': -1 })
			.skip(pagination.offset || 0)
			.limit(pagination.count || 0)
			.exec(),
		await User
			.count(query)
			.exec()
	];
};
