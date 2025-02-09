import fp from 'fastify-plugin';

async function authPlugin(app, opts) {
	app.decorateRequest('isChef', function isChef() {
		return this.headers['x-api-key'] === 'fastify-rocks';
	});

	app.decorate('authOnlyChef', async function (req, res) {
		if (!req.isChef()) {
			res.code(401);
			throw new Error('Invalid API key');
		}
	});

  // use the onRoute hook to guard every route with its route options config object whose auth prop is set to true
	app.addHook('onRoute', function hook(routeOptions) {
		if (routeOptions.config?.auth === true) {
			routeOptions.onRequest = [app.authOnlyChef].concat(routeOptions.onResponse || []);
		}
	});
}

export default fp(authPlugin);
