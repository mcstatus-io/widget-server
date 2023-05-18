import * as dotenv from 'dotenv';
import launchServer from './server.js';
import { registerFonts, loadDefaultIcon } from './widget.js';

dotenv.config();

try {
	registerFonts();
	loadDefaultIcon();

	await launchServer();

	console.log(`Listening on ${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3000}`);
} catch (e) {
	console.error('A fatal exception occurred in the server', e);
}