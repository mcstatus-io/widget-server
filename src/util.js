import superagent from 'superagent';

const validHostRegEx = /^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+(:\d{1,5})?$/;

export const getJavaStatus = async (host, port = 25565) => {
    const result = await superagent.get(`${process.env.PING_HOST || 'https://api.mcstatus.io/v2'}/status/java/${host}:${port}`);

    if (result.status !== 200) throw new Error('Unexpected status code: ' + result.status);

    return result.body;
};

export const parseAddress = (address, port = 25565) => {
    if (!validHostRegEx.test(address)) return null;

    const splitHost = address.split(':');

    if (splitHost.length > 2 || splitHost.length < 1) return null;

    if (splitHost.length < 2) return {
        host: splitHost[0],
        port
    };

    const parsedPort = parseInt(splitHost[1]);
    if (isNaN(parsedPort) || parsedPort < 0 || parsedPort > 65536 || !Number.isInteger(parsedPort)) return null;

    return {
        host: splitHost[0],
        port: parsedPort
    };
};

export const parseQueryOptions = (req) => {
    const options = { rounded: true, dark: true, border: true };

    if (typeof req.query.dark === 'string' && req.query.dark.toLowerCase() === 'false') {
        options.dark = false;
    }

    if (typeof req.query.rounded === 'string' && req.query.rounded.toLowerCase() === 'false') {
        options.rounded = false;
    }

    if (typeof req.query.border === 'string' && req.query.border.toLowerCase() === 'false') {
        options.border = false;
    }

    return options;
};