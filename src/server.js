import fastify from 'fastify';
import etag from '@fastify/etag';
import { getJavaStatus, parseQueryOptions } from './util.js';
import { generateJavaWidget } from './widget.js';

export const host = () => process.env.HOST || '127.0.0.1';
export const port = () => (isNaN(process.env.PORT) ? 3000 : parseInt(process.env.PORT)) + (isNaN(process.env.INSTANCE_ID) ? 0 : parseInt(process.env.INSTANCE_ID));

export const launchServer = async () => {
	const app = fastify();

	app.register(etag);

	app.get('/ping', (req, res) => {
		res.status(200).send('OK');
	});

	app.get('/java/:address', async (req, res) => {
		const options = parseQueryOptions(req);

		const status = await getJavaStatus(req.params.address);
		const widget = await generateJavaWidget(status, options);

		res.type('image/png').send(widget);
	});

	app.setErrorHandler((err, req, res) => {
		console.log(req.url, err);

		res.status(500).send('Internal Server Error');
	});

	app.setNotFoundHandler((req, res) => {
		res.status(404).send('Not Found');
	});

	return app.listen({ host: host(), port: port() });
};