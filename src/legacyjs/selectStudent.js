const { Keystore, AccountTools, VulcanHebe } = require('vulcan-api-js');

module.exports = {
	id: "selectstudent",
	help: "select a student from id, defaults to first student",
	async run(args) {
		if (!fs.existsSync('./auth/keystore.json') || !fs.existsSync('./auth/account.json')) return console.log('No account or keystore found, please register first');
		const keystore = new Keystore();
		keystore.loadFromJsonString(fs.readFileSync('./auth/keystore.json', { encoding: 'utf-8' }));
		const client = new VulcanHebe(keystore, AccountTools.loadFromJsonString(fs.readFileSync('./auth/account.json', { encoding: 'utf-8' })));
		if (!args[0]) {
			await client.selectStudent();
			fs.writeFileSync('./auth/student', "first", { encoding: 'utf-8' });
		}
		else {
			const studentsList = await client.getStudents();
			const student = studentsList.find(x => x.pupil.id == args[0]);
			if (!student) return console.log("student not found");
			await client.selectStudent(student);
			fs.writeFileSync('./auth/student', JSON.stringify(student, null, 2), { encoding: 'utf-8' });
		}
		console.log("successfully selected student");
	},
};