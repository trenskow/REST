'use strict';

const 
	{ Router } = require('express'),
	{ validate } = require('isvalid'),
	keyd = require('keyd');

const
	{ User, ApiError } = require('lib/model');

module.exports = exports = Router({ mergeParams: true })

	.use(
		validate.query({
			type: Object,
			unknownKeys: 'allow',
			schema: {
				auth: { type: String, match: /^[a-zA-Z0-9.\-_]+$/ }
			}
		}),
		async (req) => {

			req.auth = req.auth || {};

			const token = ((req.header('authorization') || '').match(/^Bearer ([a-zA-Z0-9.\-_]+)$/) || [])[1] || req.query.auth;

			delete req.query.auth;

			if (token) {
				req.auth.user = await User.auth(token);
			}

		}
	);

exports.must = {
	be: (options) => {
		return async (req, res) => {
			const obj = { req: req, res: res };
			if (options.user) {
				if  (!req.auth.user || !req.auth.user.equals(keyd(obj).get(options.user))) {
					throw new ApiError('not-authorized', 'Not authorized.', 403);
				}
			}
		};
	}
};
