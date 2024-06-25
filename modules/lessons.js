const { Keystore, AccountTools, VulcanHebe } = require('vulcan-api-js');
const student = require('../addons/studentFetch');
module.exports = {
	id: "lessons",
	help: "list all lessons, if date not provided defaults to today",
	async run(args) {
		if (!fs.existsSync('./auth/keystore.json') || !fs.existsSync('./auth/account.json')) return console.log('No account or keystore found, please register first');
		const keystore = new Keystore();
		keystore.loadFromJsonString(fs.readFileSync('./auth/keystore.json', { encoding: 'utf-8' }));
		const client = new VulcanHebe(keystore, AccountTools.loadFromJsonString(fs.readFileSync('./auth/account.json', { encoding: 'utf-8' })));
		// student selection
		if (!fs.existsSync('./auth/student')) return console.log('Student is not selected.');
		await client.selectStudent(student());
		// lessons
		const datearg = args[0];
		const date = datearg ? new Date(datearg) : new Date();
		const plusdate = new Date(datearg);
		plusdate.setDate(plusdate.getDate() + 1);

		const lessons = await client.getLessons(date, date);
		const substitutions = await client.getChangedLessons(date, date);
		const lessonarrays = [];
		if (lessons.length !== 0) {
			lessons.forEach(l => {
				if (!l.subject) return;
				const change = l.change;
				if (!l.visible) {
					return;
				}
				if (l.change) {
					const changeDetails = substitutions.find(s => s.id === l.change.id);
					lessonarrays.push(`${l.timeSlot.position}. ${changeDetails.subject.name} | T: ${changeDetails.teacher.displayName} | CHNG`);
				}
				else {
					const stringAdd = `${l.timeSlot.position}. ${l.subject.name} | T: ${l.teacherPrimary.displayName}`;
					const SubStringAdd = `${l.timeSlot.position}. ${l.subject.name} | T: ${l.teacherPrimary.displayName} | CHNG`;
					if (lessonarrays.includes(SubStringAdd)) return;
					lessonarrays.push(stringAdd);
				}
			});
		}
		else {
			lessonarrays.push(`You don't have any lessons!`);
		}
		// sort the array
		lessonarrays.sort((a, b) => {
			const numA = parseInt(a.split(/[. ]+/)[0]);
			const numB = parseInt(b.split(/[. ]+/)[0]);
			return numA - numB;
		});
		// display the lessons
		console.log(`Lessons in ${date.toLocaleDateString()}:`);
		console.log(lessonarrays.join('\n'));
	},
};