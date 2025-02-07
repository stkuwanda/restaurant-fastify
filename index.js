import { fastify } from 'fastify';
import appPlugin, { options } from './app.js';

const port = process.env.PORT || 3000;

const app = fastify(options);

// registering a plugin
app.register(appPlugin);

// application life-cycle hooks
// onReadey: Emitted when application is loaded by server and server is not yet listening
// for requests
// note the async function handler that nothing else needs to be called within the handler
app.addHook('onReady', async function hook() {
	this.log.info(`onReady runs from file ${import.meta.url}`);
});

// onClose: Emitted during server shutdown when server is no longer listening for requests
// note the sync function and the imperative call to the done callback method
app.addHook('onClose', function hook(app, done) {
	app.log.info(`onClose runs from file ${import.meta.url}`);
	done();
});

try {
	// host config property configures server to accept connections from any IPv4 address.
	// if app is running in Docker containers or is directly acessible on the internet, it
	// needs the host config set as below.
	await app.listen({ port, host: '0.0.0.0' });
} catch (error) {
	app.log.error(error);
}
