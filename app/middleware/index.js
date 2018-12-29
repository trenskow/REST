'use strict';

const 
	{ Router } = require('express');

module.exports = exports = Router({ mergeParams: true })

	.use(require('./log'))
	.use(require('./body-parser'))
	.use(require('./auth'))
	.use(require('./pagination'));

exports.auth = require('./auth');
