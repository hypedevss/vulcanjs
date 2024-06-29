import { Keystore, AccountTools, registerAccount } from 'vulcan-api-js';
import * as fs from 'fs';

export default {
	id: "register",
	help: "register a new session",
	async run(args: string[]): Promise<void> {
		const [symbol, pin, token] = args;
		if (!symbol || !pin || !token) {
			return console.log("Usage: vjs register <symbol> <pin> <token>");
		}
		// check if ur already registered
		if (fs.existsSync('./auth/account.json')) {
			return console.log('You are already registered');
		}
		// initialize the Keystore
		const keystore: Keystore = new Keystore();
		await keystore.init();
		fs.writeFileSync('./auth/keystore.json', keystore.dumpToJsonString(), { encoding: 'utf-8' });
		keystore.deviceModel = `vulcanjs | by realmotylek | REG: ${new Date().toISOString().split('T')[0]}`;
		const account = await registerAccount(keystore, token, symbol, pin);
		fs.writeFileSync('./auth/account.json', AccountTools.dumpToJsonString(account), { encoding: 'utf-8' });
		console.log(`successfully registered: ${account.userName}`);
	},
};