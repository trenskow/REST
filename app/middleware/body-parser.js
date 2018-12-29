'use strict';

const 
	{ Router } = require('express'),
	bodyParser = require('body-parser');

module.exports = exports = Router({ mergeParams: true })

	.use(bodyParser.json({ strict: false }));
