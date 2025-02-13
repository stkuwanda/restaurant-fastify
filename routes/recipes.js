async function menuHandler(req, res) {
	const recipes = await this.dataSource.readRecipes();
	return recipes;
}

//sync plugin, note usage of next in this synchronous plugin
export default function recipesPlugin(app, opts, next) {
	// with asynchronous handlers
	app.route({ method: 'GET', url: '/menu', handler: menuHandler });
	app.get('/recipes', { handler: menuHandler });

	// protected routes
	// with async handler
	const jsonSchemaBody = {
		type: 'object',
		required: ['name', 'country', 'order', 'price'],
		properties: {
			name: { type: 'string', minLength: 3, maxLength: 50 },
			country: { type: 'string', enum: ['ITA', 'IND', 'ZW'] },
			description: { type: 'string', minLength: 7, maxLength: 7000 },
			order: { type: 'number', minimum: 0, maximum: 100 },
			price: { type: 'number', minimum: 0, maximum: 70 },
		},
	};

	app.post('/recipes', {
		config: { auth: true },
		schema: { body: jsonSchemaBody },
		handler: async function addToMenu(req, res) {
			const { name, country, description, order, price } = req.body;
			const { insertRecipe } = app.dataSource;

			const newDishId = await insertRecipe({
				name,
				country,
				description,
				order,
				price,
				createdAt: new Date(),
			});

			res.code(201);
			return { id: newDishId };
		},
	});

	// with synchronous handler
	app.delete('/recipes/:id', {
		config: { auth: true },
		handler: function removeFromMenu(req, res) {
			res.send(new Error('Not implemented!')); // note the imperative use of the res.send(new Error()) method for the synchronous handler
		},
	});

	next();
}

// do not use res.send() with async handlers and do not use direct returns (or throws) with sync handlers
