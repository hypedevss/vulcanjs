import { Keystore, AccountTools, VulcanHebe } from 'vulcan-api-js';
import * as fs from 'fs';
import * as student from '../addons/studentFetch';

export default {
	id: "luckynumber",
	help: "displays todays lucky number",
	async run(args: string[]) {
		if (!fs.existsSync('./auth/keystore.json') || !fs.existsSync('./auth/account.json')) return console.log('No account or keystore found, please register first');
		const keystore = new Keystore();
		keystore.loadFromJsonString(fs.readFileSync('./auth/keystore.json', { encoding: 'utf-8' }));
		const client = new VulcanHebe(keystore, AccountTools.loadFromJsonString(fs.readFileSync('./auth/account.json', { encoding: 'utf-8' })));
		// student selection
		await client.selectStudent(student.default());
		const luckyNumber = await client.getLuckyNumber();
		console.log(`Todays lucky number is: ${luckyNumber.number || 'none'}`);
	},
}