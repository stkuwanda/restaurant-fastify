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
		readRecipes: async function (filters, sort = { order: 1 }) {
			const { db } = app.mongo;
			const menuCollection = db.collection('menu');

			try {
				const result = await menuCollection.find(filters).sort(sort).toArray();
				return result;
			} catch (error) {
				app.log.error(error);
				throw error;
			}
		},
		deleteRecipe: async function (recipeId) {
			const { db, ObjectId } = app.mongo;
			const menuCollection = db.collection('menu');

			try {
				const result = await menuCollection.deleteOne({
					_id: new ObjectId(recipeId),
				});
				
				return result.deletedCount;
			} catch (error) {
				app.log.error(error);
				throw error;
			}
		},
		insertOrder: async function (order) {},
		readOrders: async function (filters, sort) {},
		markOrderAsDone: async function (orderId) {},
	});
}

export default fp(dataSourcePlugin);
