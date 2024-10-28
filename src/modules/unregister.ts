import { Keystore } from "hebece";
import { unlinkSync } from "fs";
import * as chalk from 'chalk';
import { mainMenu } from "..";
export default {
	id: "unregister",
	help: "forget a session",

	run(): void {
		console.clear();
		const keystore = new Keystore('./auth/keystore.json', true);
		const kpStore = new Keystore('./auth/keypair.json', false);
		unlinkSync(keystore.path);
		unlinkSync(kpStore.path);
		console.log(`${chalk.green(`Session data forgotten.`)} Please wait...`);
		setTimeout(() => {
			console.clear();
			mainMenu();
		}, 2000);
	}
};