const serverConfigOptions = { logger: true };

// asynchronous version
export default async function appPlugin(app, options) {
	app.get('/', async function rootHandler() {
		return { api: 'restaurant-api', version: '0.1.0' };
	});
}

export { serverConfigOptions as options };

// synchronous version
// export default function syncAppPlugin(app, options, next) {
// 	app.get('/', async function rootHandler() {
// 		return { api: 'restaurant-api', version: '0.1.0' };
// 	});
// }
