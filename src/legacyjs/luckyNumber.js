const { Keystore, AccountTools, VulcanHebe } = require('vulcan-api-js');
const student = require('../addons/studentFetch');

module.exports = {
	id: "luckynumber",
	help: "displays todays lucky number",
	async run(args) {
		if (!fs.existsSync('./auth/keystore.json') || !fs.existsSync('./auth/account.json')) return console.log('No account or keystore found, please register first');
		const keystore = new Keystore();
		keystore.loadFromJsonString(fs.readFileSync('./auth/keystore.json', { encoding: 'utf-8' }));
		const client = new VulcanHebe(keystore, AccountTools.loadFromJsonString(fs.readFileSync('./auth/account.json', { encoding: 'utf-8' })));
		if (!fs.existsSync('./auth/student')) return console.log('Student is not selected.');
		await client.selectStudent(student());
		const luckyNumber = await client.getLuckyNumber();
		console.log(`Todays lucky number is: ${luckyNumber.number || 'none'}`);
	},
};