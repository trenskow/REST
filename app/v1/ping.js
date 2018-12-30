'use strict';

const 
	{ Router } = require('express');

const
	{ ApiError } = require('lib/model');

module.exports = exports = Router({ mergeParams: true })

	.get(
		'/',
		(req, res) => {
			res.json({ ping: 'pong' });
		}
	)

	.all('/',
		async (req, res) => {
			res.setHeader('Allow', 'GET, HEAD, OPTIONS');
			throw new ApiError('method-not-allowed', 'Method not allowed.', 405);
		});
