'use strict';

module.exports = exports = class ApiError extends Error {

	constructor(name, message, status = 400) {
		super(message);
		this._name = name;
		this._status = status;
	}

	get name() {
		return this._name;
	}

	get status() {
		return this._status;
	}

};
