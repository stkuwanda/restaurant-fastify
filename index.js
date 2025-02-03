import { fastify } from 'fastify';

const port = process.env.PORT || 3000;
const options = { logger: true };
const app = fastify(options);

app.get('/', async function handler() {
	return { api: 'restaurant-api', version: '0.1.0' };
});

try {
  // host config property configures server to accept connections from any IPv4 address.
  // if app is running in Docker containers or is directly acessible on the internet, it 
  // needs the host config set as below.
	await app.listen({ port, host: '0.0.0.0' }); 
} catch (error) {
	app.log.error(error);
}
