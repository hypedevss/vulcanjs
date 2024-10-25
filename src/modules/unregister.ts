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
		unlinkSync(keystore.path);
		console.log(`${chalk.green(`Session data forgotten.`)} Please wait...`);
		setTimeout(() => {
			console.clear();
			mainMenu();
		}, 2000);
	}
};