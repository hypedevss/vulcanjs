import { Keystore, AccountTools, VulcanHebe, Lesson, ChangedLesson } from 'vulcan-api-js';
import * as fs from 'fs';
import * as student from '../addons/studentFetch';
import * as partial from '../addons/partialWord';


export default {
	id: "grades",
	help: "check if you studied well",
	run: async (args: string[]) => {
		if (!fs.existsSync('./auth/keystore.json') || !fs.existsSync('./auth/account.json')) return console.log('No account or keystore found, please register first');
		const keystore = new Keystore();
		keystore.loadFromJsonString(fs.readFileSync('./auth/keystore.json', { encoding: 'utf-8' }));
		const client = new VulcanHebe(keystore, AccountTools.loadFromJsonString(fs.readFileSync('./auth/account.json', { encoding: 'utf-8' })));
		// student selection
		if (!fs.existsSync('./auth/student')) return console.log('Student is not selected.');
		await client.selectStudent(student.default());
		const grades = await client.getGrades(new Date());
		const subject = args.join(' ').charAt(0).toUpperCase() + args.join(' ').slice(1);
		if (!subject) {
			// show subjects you can check and how many grades do you have for them
			const subjects: string[] =  [];
			grades.forEach(g => {
				// count grades
				const gradeSubject = g.column.subject.name;
				const count = grades.filter(gr => gr.column.subject.name === gradeSubject).length;
				if (subjects.includes(`${gradeSubject} - ${count} grades`)) return;
				subjects.push(`${gradeSubject} - ${count} grades`);
			});
			// filter grades from most grades to least
			subjects.sort((a, b) => {
				const numA = parseInt(a.split('-')[1]);
				const numB = parseInt(b.split('-')[1]);
				return numB - numA;
			});
			console.log(`Please select a subject that you want to check grades for:`);
			console.log('Usage: vjs grades <subject>');
			console.log(subjects.join('\n'));
		}
		else {
			// the rest of grade fetch logic
			const rawSubjects: string[] = [];
			grades.forEach(g => {
				const gradeSubject = g.column.subject.name;
				if (rawSubjects.includes(gradeSubject)) return;
				rawSubjects.push(gradeSubject);
			});
			const findpartial = rawSubjects.find(s => partial.default(s, subject)) || subject;
			const gradesFromSubject = grades.filter(g => g.column.subject.name === findpartial);
			if (gradesFromSubject.length === 0) return console.log(`No grades found for ${findpartial}`);
			const gradesarray: string[] = [];
			gradesFromSubject.forEach(g => {
				const gradeString = `${g.column.name || "Unspecified"} | ${g.contentRaw} || W: ${g.column.weight}`;
				gradesarray.push(gradeString);
			});
			// sort the array, best grade to the worst grade, number+ is counted normally, same with number-, the + grades is on the bottom
			gradesarray.sort((a, b) => {
				const unparsedA = a.split('|')[1].replaceAll('+', '').replaceAll('-', '').replaceAll(' (%)', '');
				const unparsedB = b.split('|')[1].replaceAll('+', '').replaceAll('-', '').replaceAll(' (%)', '');
				const parseA = parseFloat(unparsedA);
				const parseB = parseFloat(unparsedB);
				return parseB - parseA;
			});
			console.log(`Grades for ${findpartial}:`);
			console.log(gradesarray.join('\n'));
		}
	}
}