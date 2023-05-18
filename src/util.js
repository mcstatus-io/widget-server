import superagent from 'superagent';

export const getJavaStatus = async (address) => {
	const result = await superagent.get(`${process.env.PING_HOST || 'https://api.mcstatus.io/v2'}/status/java/${encodeURIComponent(address)}`);

	if (result.status !== 200) throw new Error('Unexpected status code: ' + result.status);

	return result.body;
};

export const parseQueryOptions = (req) => {
	const options = { rounded: true, dark: true };

	if (typeof req.query.dark === 'string' && req.query.dark.toLowerCase() === 'false') {
		options.dark = false;
	}

	if (typeof req.query.rounded === 'string' && req.query.rounded.toLowerCase() === 'false') {
		options.rounded = false;
	}

	return options;
};