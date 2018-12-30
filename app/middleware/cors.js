'use strict';

const
	{ Router } = require('express'),
	cors = require('cors');

module.exports = exports = Router({ mergeParams: true })

	.options('*', cors({
		origin: '*',
		methods: 'GET,HEAD,POST,PUT,DELETE'
	}));
