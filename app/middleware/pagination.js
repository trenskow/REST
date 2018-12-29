'use strict';

const 
	{ Router } = require('express'),
	{ validate } = require('isvalid');

module.exports = exports = Router({ mergeParams: true })

	.use(
		validate.query({
			type: Object,
			unknownKeys: 'allow',
			schema: {
				'offset': { type: Number, default: 0 },
				'count': { type: Number, default: 10, range: '1-100' }
			}
		}),
		async (req, res) => {
			
			req.pagination = {
				offset: req.query.offset,
				count: req.query.count
			};

			delete req.query.offset;
			delete req.query.count;

			res.paginated = {
				json: ([items, total]) => {
					res.json({
						'offset': req.pagination.offset,
						'count': items.length,
						'total': total || items.length,
						'items': items
					});
				}
			};
			
		});