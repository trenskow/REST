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
		validate.body({
			type: String, required: true, match: /^.{8,}$/
		}),
		async (req, res) => {
			if (!await req.user.auth(req.query.password)) {
				throw new ApiError('not-found', 'User not found.', 404);
			}
			await req.user.change({
				password: req.body
			});
			res.sendStatus(204);
		}
	)

	.all('/',
		async () => {
			throw new ApiError('method-not-allowed', 'Method not allowed.', 405);
		});
