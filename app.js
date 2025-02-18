import recipesPlugin from './routes/recipes.js';
import ordersPlugin from './routes/orders.js';
import authPlugin from './plugins/auth.js';
import dataSourcePlugin from './plugins/datasource.js';

// setup fastify logger.
// setup ajv request/response validation module to output to list 
// all errors instead of the first hit error.
// setup ajav req/res validator to drop all non-schema properties
// 
const serverConfigOptions = {
	logger: true,
	ajv: { customOptions: { allErrors: true, removeAdditional: 'all' } },
};

// asynchronous version
export default async function appPlugin(app, options) {
	app.get('/', async function rootHandler() {
		return { api: 'restaurant-api', version: '0.1.0' };
	});

	app.register(dataSourcePlugin);
	app.register(authPlugin);
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
