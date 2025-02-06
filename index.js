import { fastify } from 'fastify';
import appPlugin, { options } from './app.js';

const port = process.env.PORT || 3000;

const app = fastify(options);

// registering a plugin
app.register(appPlugin);

try {
	// host config property configures server to accept connections from any IPv4 address.
	// if app is running in Docker containers or is directly acessible on the internet, it
	// needs the host config set as below.
	await app.listen({ port, host: '0.0.0.0' });
} catch (error) {
	app.log.error(error);
}
