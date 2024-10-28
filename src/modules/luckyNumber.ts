import { AlignmentEnum, AsciiTable3 } from "ascii-table3";
import keypairManager from "../addons/keypairManager";
import { VulcanHebeCe } from "hebece";
import * as chalk from 'chalk';
import { input, mainMenu } from "..";
export default {
	id: "lucky",
	help: "views today lucky number",
	async run(): Promise<void> {
		const keypair = await keypairManager();
		console.clear();
		if (keypair.err === 1) {
			console.log(`${chalk.red('You are not logged in.')}`);
			setTimeout(() => {
				console.clear();
				mainMenu();
			}, 2500);
			return;
		}
		const hebe = new VulcanHebeCe(keypair.kp, keypair.rest);
		await hebe.connect();
		const luckyNumber = await hebe.getLuckyNumber();
		const table = new AsciiTable3(chalk.bold('  Lucky number  '));
		table.setHeading(' ', 'num', '');
		table.setStyle('unicode-single');
		table.setAlign(3, AlignmentEnum.CENTER);
		table.addRow('   ', luckyNumber.Envelope.Number, '   ');
		console.log(table.toString());
		console.log(`Press ${chalk.bold("ENTER")} to continue...`);
		input.hide('');
		console.clear();
		mainMenu();
	}
};