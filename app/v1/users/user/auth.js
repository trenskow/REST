'use strict';

const 
	{ Router } = require('express'),
	{ validate } = require('isvalid');

const
	{ ApiError } = require('lib/model');

module.exports = exports = Router({ mergeParams: true })

	.post('/',
		validate.query({
			'password': { type: String, required: true }
		}),
		async (req, res) => {
			if (!await req.user.auth(req.query.password)) {
				throw new ApiError('not-found', 'User not found.', 404);
			}
			res.status(201).json({
				'token': await req.user.jwt()
			});
		}
	)

	.all('/',
		async (req, res) => {
			res.setHeader('Allow', 'POST, OPTIONS');
			throw new ApiError('method-not-allowed', 'Method not allowed.', 405);
		});
