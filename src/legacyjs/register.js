const { Keystore, AccountTools, registerAccount } = require('vulcan-api-js');
module.exports = {
	id: "register",
	help: "register a new session",
	async run(args) {
		const [symbol, pin, token] = args;
		if (!symbol || !pin || !token) return console.log("Usage: vjs register <symbol> <pin> <token>");
		// initialize the Keystore
		const keystore = new Keystore();
		await keystore.init();
		fs.writeFileSync('./auth/keystore.json', keystore.dumpToJsonString(), { encoding: 'utf-8' });
		keystore.deviceModel = "vulcanjs | by realmotylek";
		const account = await registerAccount(keystore, token, symbol, pin);
		fs.writeFileSync('./auth/account.json', AccountTools.dumpToJsonString(account), { encoding: 'utf-8' });
		console.log(`successfully registered: ${account.userName}`);
	},
};