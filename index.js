// menu handler
const { Collection } = require('@discordjs/collection');
globalThis.fs = require('fs');
const input = require('prompt-sync')();

const menuModules = globalThis.fs.readdirSync('./modules').filter(file => file.endsWith('.js'));
const modules = new Collection();

for (const file of menuModules) {
	const files = require(`./modules/${file}`);
	modules.set(files.id, files);
}

const argv = process.argv.slice(2);

const menu = argv[0]
const args = argv.slice(1);

function execute() {
	const menuData = modules.get(menu);
	if (!menuData) {
		const helpMap = modules.map(x => `	${x.id} - ${x.help}`).join('\n');
		console.log('vulcanjs - help\n' + helpMap + '\nmade by @realmotylek');
		return;
	}

	menuData.run(args);
}

execute();