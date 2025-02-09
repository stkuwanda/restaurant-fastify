import appPlugin from "../app.js";

export default async function authPlugin(app, opts) {
	app.decorateRequest('isChef', function isChef() {
		return this.headers['x-api-key'] === 'fastify-rocks';
	});

	app.decorate('authOnlyChef', async function (req, res) {
		if (!req.isChef()) {
			res.code(401);
			throw new Error('Invalid API key');
		}
	});

  app.register(appPlugin);
}
