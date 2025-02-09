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
  
}

export default fp(authPlugin);
