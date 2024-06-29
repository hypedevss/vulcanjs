import * as fs from 'fs';
import * as path from 'path';

interface MenuModule {
	id: string;
	help: string;
	run(args: string[]): void;
}

const menuModules: string[] = fs.readdirSync('./modules').filter((file: string) => file.endsWith('.js') || file.endsWith('.ts'));
const modules = new Map<string, MenuModule>();

for (const file of menuModules) {
	const module = path.resolve('./modules', file);
	const files = require(module);
	modules.set(files.default.id, files.default);
}

const argv = process.argv.slice(2);

const menu = argv[0];
const args = argv.slice(1);
function execute() {
	const menuData = modules.get(menu);
	if (!menuData) {
		const helpMap = Array.from(modules).map(x => `	${x[1].id} - ${x[1].help}`).join('\n');
		console.log('vulcanjs - help\n' + helpMap + '\nmade by @realmotylek');
		return;
	}
	menuData.run(args);
}

execute();