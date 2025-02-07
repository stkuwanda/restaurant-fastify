// async plugin
export default async function ordersPlugin(app, opts) {
	async function notImplemented(req, res) {
		throw new Error('Not implemented!');
	}

	app.get('/orders', { handler: notImplemented });
	app.post('/orders', { handler: notImplemented });
	app.patch('/orders/:id', { handler: notImplemented, onRequest: app.authOnlyChef });

	app.addHook('onReady', async function hook() {
		this.log.info(`onReady runs from file ${import.meta.url}`);
	});
	
	// onClose: Emitted during server shutdown when server is no longer listening for requests
	app.addHook('onClose', function hook(app, done) {
		app.log.info(`onClose runs from file ${import.meta.url}`);
		done();
	});
}
