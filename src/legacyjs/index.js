// menu handler
globalThis.fs = require('fs');

const menuModules = globalThis.fs.readdirSync('./modules').filter(file => file.endsWith('.js'));
const modules = new Map();

for (const file of menuModules) {
	const files = require(`./modules/${file}`);
	modules.set(files.id, files);
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