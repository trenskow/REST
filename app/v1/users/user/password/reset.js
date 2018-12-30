'use strict';

const
	{ Router } = require('express');

const
	{ User, ApiError } = require('lib/model');

module.exports = exports = Router({ mergeParams: true })

	.post('/',
		async (req, res) => {
			req.user = await User.get(req.params.user);
			if (req.user) {
				req.user.resetPassword();
			}
			res.sendStatus(201);
		})

	.all('/',
		async (req, res) => {
			res.setHeader('Allow', 'POST, OPTIONS');
			throw new ApiError('method-not-allowed', 'Method not allowed.', 405);
		});
