const { Keystore, AccountTools, VulcanHebe } = require('vulcan-api-js');
const student = require('../addons/studentFetch');
module.exports = {
	id: "lessons",
	help: "list all lessons, if date not provided defaults to today",
	async run(args) {
		if (!fs.existsSync('./auth/keystore.json') || !fs.existsSync('./auth/account.json')) return console.log('No account or keystore found, please register first');
		const keystore = new Keystore();
		keystore.loadFromJsonString(fs.readFileSync('./auth/keystore.json', { encoding: 'utf-8' }));
		const client = new VulcanHebe(keystore, AccountTools.loadFromJsonString(fs.readFileSync('./auth/account.json', { encoding: 'utf-8' })));
		// student selection
		await client.selectStudent(student());
		// lessons
		const datearg = args[0];
		const date = datearg ? new Date(datearg) : new Date();

		const lessons = await client.getLessons(date, new Date());
		console.log(lessons);
	},
};