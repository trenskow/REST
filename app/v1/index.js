'use strict';

const 
	{ Router } = require('express');

module.exports = exports = Router({ mergeParams: true })

	.use('/ping/', require('./ping'))
	.use('/users/', require('./users'));
