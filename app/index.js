'use strict';

const 
	{ Router } = require('express');

const
	{ ApiError } = require('lib/model');

module.exports = exports = Router({ mergeParams: true })

	// We start by adding the middleware.
	.use(require('./middleware'))
	
	// Mount the v1 API.
	.use('/v1/', require('./v1'))

	// Add catch all (for not found resources).
	.use(async () => {
		throw new ApiError('not-found', 'Resource not found', 404);
	})

	// Add error handler.
	.use((err, req, res, next_ignoreUnused) => {
		
		// If validation error we assign it a name.
		if (err.constructor.name === 'ValidationError') {
			err.name = 'validation-error';
			err.status = 400;
		}

		// If status, name or message is not available it is not an ApiError
		// and is therefore an internal error.
		if (!err.status) {
			console.error(err.stack);
			err = new ApiError('internal-error', 'Internal error.', 500);
		}

		// Send the status.
		res.status(err.status || 400).json({ 
			error: {
				name: err.name.split(/(?=[A-Z])/).join('-').toLowerCase(),
				message: err.message,
				keyPath: err.keyPath ? err.keyPath.join('.') : undefined
			}
		});

	});
