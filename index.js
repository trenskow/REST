'use strict';

const express = require('express'),
	mongoose = require('mongoose'),
	methods = require('methods'),
	flatten = require('array-flatten');

// This module helps get rid of relative paths in require.
require('app-module-path').addPath(__dirname);

// We iterate through the router keys.
methods.concat(['use','param','route','all']).forEach((key) => {

	// Keep the old implementation.
	let old = express.Router[key];

	// Replace with new.
	express.Router[key] = function(...args) {
		
		// Flatten arguments (express does this also).
		args = flatten(args);

		// Map the arguments.
		args = args.map((arg) => {

			// If argument is not an async function - we just return it.
			if (arg.constructor.name !== 'AsyncFunction') return arg;

			// - otherwise we wrap it in a traditional route and return that.
			return (req, res, next, ...args) => {
				arg.apply(null, [req, res].concat(args))
					.then(() => {
						if (!res.headersSent) next();
					})
					.catch((err) => {
						next(err);
					});
			};

		});

		// Apply new arguments to old implementation.
		return old.apply(this, args);

	};

});

mongoose.connect(process.env.MONGO_DB || `mongodb://localhost/${process.env.DB_NAME || 'rest'}`, {

	useNewUrlParser: true,
	useCreateIndex: true

}).then(() => {

	express()
		.use(require('./app'))
		.listen(process.env.PORT || 3000);

}).catch((err) => {
	console.error(err.stack);
	process.exit(1);
});
