import * as fs from 'fs';
import * as path from 'path';
import * as im from 'prompt-sync';
const input = im();
import * as ce from 'hebece';
import * as chalk from 'chalk';
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';
interface MenuModule {
	id: string;
	help: string;
	run(): void;
}

const menuModules: string[] = fs.readdirSync('./modules').filter((file: string) => file.endsWith('.js') || file.endsWith('.ts'));
const modules = new Map<string, MenuModule>();

for (const file of menuModules) {
	const module = path.resolve('./modules', file);
	const files = require(module);
	modules.set(files.default.id, files.default);

}

function mainMenu() {
	const menuAscii = new AsciiTable3(chalk.bold('vulcanjs - by @realmotylek'))
		.setHeading('num', 'module', 'desc')
		.setAlign(3, AlignmentEnum.CENTER)
		.setStyle('unicode-single')

	modules.forEach((module) => {
		const moduleNum = Array.from(modules).map((x) => x[0]).indexOf(module.id) + 1
		menuAscii.addRow(chalk.bold(moduleNum), module.id, module.help)
	})
	menuAscii.addRow(chalk.bold('q'), 'exit', 'exit')

	console.log(menuAscii.toString())
	const menuinput = input(`num: `)
	if (menuinput) {
		if (menuinput == 'q') {
			process.exit()
		}
		const selectedModule = modules.get(Array.from(modules)[menuinput - 1][0])
		selectedModule.run()
	}
}

mainMenu()


export {
	input,
	mainMenu
}