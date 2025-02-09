// async plugin
export default async function ordersPlugin(app, opts) {
	async function notImplemented(req, res) {
		throw new Error('Not implemented!');
	}

	app.get('/orders', { handler: notImplemented });
	app.post('/orders', { handler: notImplemented });

	// protected route
	app.patch('/orders/:id', { handler: notImplemented, config: { auth: true } });
}
