async function menuHandler(req, res) {
	const recipes = await this.dataSource.readRecipes();
	return recipes;
}

//sync plugin, note usage of next in this synchronous plugin
export default function recipesPlugin(app, opts, next) {
	// with asynchronous handlers
	app.route({ method: 'GET', url: '/menu', handler: menuHandler });
	app.get('/recipes', { handler: menuHandler });

	// request validation schemas
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

	const jsonSchemaHeaders = {
		type: 'object',
		required: ['x-api-key'],
		properties: {
			'x-api-key': { type: 'string', minLength: 3, maxLength: 50 },
		},
	};

	const jsonSchemaParams = {
		type: 'object',
		required: ['id'],
		properties: {
			id: { type: 'string', minLength: 24, maxLength: 24 },
		},
	};

	// protected routes
	// with async handler
	app.post('/recipes', {
		config: { auth: true },
		schema: { body: jsonSchemaBody, headers: jsonSchemaHeaders },
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
		schema: { headers: jsonSchemaHeaders, params: jsonSchemaParams },
		handler: function removeFromMenu(req, res) {
			const { id } = req.params;
			const { deleteRecipe, readRecipes } = app.dataSource;

			// note the promises are using the more verbose then-catch approach as context of handler is synchronous
			readRecipes({ id })
				.then((result) => {
					const [recipe] = result;

					if (recipe) {
						deleteRecipe(id)
							.then((count) => {
								res.code(204); // note nothing will be sent after status code 204
								// res.send({ operation: 'deletion', result: 'success', count }); // this will not run since status code is 204
							})
							.catch((error) => {
								throw error;
							});
					} else {
						res.code(404);
						throw new Error('Not found!');
					}
				})
				.catch((error) => {
					res.send(error); // note the imperative use of the res.send(new Error()) method for the synchronous handler
				});
		},
	});

	next();
}

// do not use res.send() with async handlers and do not use direct returns (or throws) with sync handlers
