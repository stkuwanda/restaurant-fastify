import fp from 'fastify-plugin';
import fastifyMongodb from '@fastify/mongodb';

async function dataSourcePlugin(app, opts) {
	app.log.info('Connecting to database...');
	app.register(fastifyMongodb, { url: 'mongodb://localhost:27017/restaurant' });

	app.decorate('dataSource', {
		insertRecipe: async function (recipe) {
			const { db, ObjectId } = app.mongo;
			recipe._id = new ObjectId();
			recipe.id = recipe._id.toString();
			const menuCollection = db.collection('menu');

			try {
				const result = await menuCollection.insertOne(recipe);
				return result.insertedId;
			} catch (error) {
				app.log.error(error);
        throw error;
			}
		},
		readRecipes: async function (filters, sort) {},
		deleteRecipe: async function (recipeId) {},
		insertOrder: async function (order) {},
		readOrders: async function (filters, sort) {},
		markOrderAsDone: async function (orderId) {},
	});
}

export default fp(dataSourcePlugin);
