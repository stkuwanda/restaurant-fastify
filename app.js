import recipesPlugin from './routes/recipes.js';
import ordersPlugin from './routes/orders.js';

const serverConfigOptions = { logger: true };

// asynchronous version
export default async function appPlugin(app, options) {
	app.decorateRequest('isChef', function isChef() {
		return this.headers['x-api-key'] === 'fastify-rocks';
	});

	app.decorate('authOnlyChef', async function (req, res) {
		if (!req.isChef()) {
			res.code(401);
			throw new Error('Invalid API key');
		}
	});

	app.get('/', async function rootHandler() {
		return { api: 'restaurant-api', version: '0.1.0' };
	});

	app.register(recipesPlugin);
	app.register(ordersPlugin);
}

export { serverConfigOptions as options };

// synchronous version
// export default function syncAppPlugin(app, options, next) {
// 	app.get('/', async function rootHandler() {
// 		return { api: 'restaurant-api', version: '0.1.0' };
// 	});
//  next();
// }
