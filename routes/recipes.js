function menuHandler(req, res) {
	this.log.info('Logging GET /menu from this');
	req.log.info('Logging GET /menu from req (request object)');
	throw new Error('Not implemented!');
}

export default function recipesPlugin(app, opts, next) {
	app.route({ method: 'GET', url: '/menu', handler: menuHandler });
	next();
}
