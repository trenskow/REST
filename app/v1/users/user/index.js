'use strict';

const 
	{ Router } = require('express'),
	{ validate } = require('isvalid');

const
	{ User, ApiError } = require('lib/model'),
	{ auth } = require('app/middleware');

module.exports = exports = Router({ mergeParams: true })

	// We use this here because we want it to bypass
	// any lookup of user and authentication.
	.use('/password/reset/',
		require('./password/reset')
	)

	.use('/',
		async (req) => {
			req.user = await User.get(req.params.user);
			if (!req.user) throw new ApiError('not-found', 'User not found.', 404);
		}
	)

	.get('/',
		async (req, res) => {
			res.status(200).json(req.user);
		}
	)

	.use('/auth/', require('./auth'))

	// From this point onwards all endpoints
	// requires the user to be authenticated
	.use('/',
		auth.must.be({
			user: 'req.user'
		})
	)

	.put('/',
		validate.body({
			'name': { type: String, required: true, match: /^.+/ },
			'email': { type: String, required: true, match: /[^@]+@[^.]+\..+$/}
		}),
		async (req, res) => {
			await req.user.change(req.body);
			res.sendStatus(204);
		}
	)

	.delete('/',
		auth.must.be({
			user: 'req.user'
		}),
		async (req, res) => {
			await req.user.delete();
			res.sendStatus(204);
		}
	)

	.all('/',
		async (req, res) => {
			res.setHeader('Allow', 'GET, HEAD, PUT, DELETE, OPTIONS');
			throw new ApiError('method-not-allowed', 'Method not allowed.', 405);
		})

	.use('/password/', require('./password'));
