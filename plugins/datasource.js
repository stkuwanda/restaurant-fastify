import fp from 'fastify-plugin';
import fastifyMongodb from '@fastify/mongodb';

async function dataSourcePlugin(app, opts) {
	app.log.info('Connecting to database...');
	app.register(fastifyMongodb, { url: 'mongodb://localhost:27017/restaurant' });
}

export default fp(dataSourcePlugin);
