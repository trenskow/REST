'use strict';

const 
	{ Router } = require('express'),
	{ validate } = require('isvalid'),
	merge = require('merge');

const
	{ User, ApiError } = require('lib/model');

module.exports = exports = Router({ mergeParams: true })

	.get('/', 
		validate.query({
			'q': { type: String, required: true, match: /^[^\s]{3,}$/ }
		}),
		async (req, res) => {
			res.paginated.json(await User.search(req.query.q, req.pagination));
		})

	.post('/',
		validate.body({
			'name': { type: String, required: true, match: /^.+/ },
			'email': { type: String, required: true, match: /[^@]+@[^.]+\..+$/},
			'password': { type: String, required: true, match: /^.{8,}$/ }
		}),
		async (req, res) => {
			res.status(201).json(await User.create(merge(req.body, {
				_password: req.body.password,
				password: undefined
			})));
		})

	.all('/',
		async () => {
			throw new ApiError('method-not-allowed', 'Method not allowed.', 405);
		})

	.use('/:user/',
		require('./user')
	);
