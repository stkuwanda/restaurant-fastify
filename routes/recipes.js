async function menuHandler(req, res) {
	this.log.info('Logging GET /menu from this');
	req.log.info('Logging GET /menu from req (request object)');
	throw new Error('Not implemented!');
}

//sync plugin, note usage of next in this synchronous plugin
export default function recipesPlugin(app, opts, next) {
	// with asynchronous handlers
	app.route({ method: 'GET', url: '/menu', handler: menuHandler });
	app.get('/recipes', { handler: menuHandler });

	// guard all recipes routes with app decorator
	app.register(async function routesGuardPlugin(plugin, opts) {
		// authentication using a hook and app decorator
		plugin.addHook('onRequest', plugin.authOnlyChef);

		plugin.post('/recipes', async function addToMenu(req, res) {
			throw new Error('Not implemented!'); // note the direct throw of Errors in the async handlers
		});

		// with synchronous handlers
		plugin.delete('/recipes/:id', function removeFromMenu(req, res) {
			res.send(new Error('Not implemented!')); // note the imperative use of the res.send(new Error()) method for the synchronous handler
		});
	});

	app.addHook('onReady', async function hook() {
		this.log.info(`onReady runs from file ${import.meta.url}`);
	});
	
	// onClose: Emitted during server shutdown when server is no longer listening for requests
	app.addHook('onClose', function hook(app, done) {
		app.log.info(`onClose runs from file ${import.meta.url}`);
		done();
	});

	next();
}

// do not use res.send() with async handlers and do not use direct returns (or throws) with sync handlers
