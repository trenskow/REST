'use strict';

const
	{ Router } = require('express'),
	morgan = require('morgan');

// We override the build-in url token.
morgan.token('url', (req) => {

	// Mask out any passwords.
	return req.originalUrl
		.replace(/(\?|&)password=.*?(&|$)/, '$1password=********$2')
		.replace(/(\?|&)auth=.*?(&|$)/, '$1auth=********$2');
	
});

module.exports = exports = Router({ mergeParams: true })

	.use(morgan('tiny'));
