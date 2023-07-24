import * as dotenv from 'dotenv';
import { launchServer, host, port } from './server.js';
import { registerFonts, loadDefaultIcon } from './widget.js';

dotenv.config();

try {
    registerFonts();
    await loadDefaultIcon();
    await launchServer();

    console.log(`Listening on ${host()}:${port()}`);
} catch (e) {
    console.error('A fatal exception occurred in the server', e);
}