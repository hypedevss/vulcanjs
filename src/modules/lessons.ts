import keypairManager from "../addons/keypairManager";
import { VulcanHebeCe } from "hebece";
import * as chalk from 'chalk';
import { mainMenu, input } from "..";
import { AlignmentEnum, AsciiTable3 } from "ascii-table3";
import * as moment from 'moment';
const changeTranslations = {
	"Uczniowie zwolnieni do domu": 0, // cancelled
	"Zastępstwo": 1, // substitions
	"Uczniowie przychodzą później": 0 // cancelled (first lesson)
};

export default {
	id: "lessons",
	help: "list your lessons",
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
		let date = new Date();
		let lessonArray = [];
		
		async function getLessons() {
			const lessonsRaw = await hebe.getLessons(date, date);
			const changedLessons = await hebe.getChangedLessons(date, date);
			const lessons = lessonsRaw.Envelope;
			const changed = changedLessons.Envelope;
			lessons.forEach((l) => {
				// if (!l.Subject) return;
				const change = l.Change;
				if (change) {
					const changeDetails = changed.find((c) => c.Change.Id === change.Id);
					if (changeDetails) {
						lessonArray.push({
							timeSlot: l.TimeSlot,
							subject: changeDetails.Subject,
							teacher: changeDetails.TeacherPrimary,
							reason: changeDetails.Reason,
							effectName: changeDetails.TeacherAbsenceEffectName
						});
					} 
				} else {
					lessonArray.push({
						timeSlot: l.TimeSlot,
						subject: l.Subject,
						teacher: l.TeacherPrimary,
						reason: null,
						effectName: null,
					});
				}
			});
			const table = new AsciiTable3(chalk.bold(`Lessons on day ${moment(date).format('DD.MM.YYYY')}`));
			table.setHeading('Starts', 'Ends', 'Pos', 'Subject', 'Teacher');
			table.setStyle('unicode-single');
			table.setAlign(3, AlignmentEnum.CENTER);
			// sort lessons by time
			lessonArray.sort((a, b) => {
				return a.timeSlot.Id - b.timeSlot.Id;
			});
			lessonArray.forEach((l) => {
				// cancelled lessons handling
				if (changeTranslations[l.effectName] === 0) {
					const normalLesson = lessons.find((less) => less.TimeSlot.Id === l.timeSlot.Id);
					const pos = normalLesson.TimeSlot.Position;
					const starts = normalLesson.TimeSlot.Start;
					const ends = normalLesson.TimeSlot.End;
					const subj = normalLesson.Subject.Name;
					const teach = normalLesson.TeacherPrimary.DisplayName;
					table.addRow(chalk.red(starts), chalk.red(ends), chalk.red(pos), chalk.red(chalk.strikethrough(subj)), chalk.red(chalk.strikethrough(teach)));
				} else if (changeTranslations[l.effectName] === 1) {
					const pos = chalk.yellow(l.timeSlot.Position);
					const starts = chalk.yellow(l.timeSlot.Start);
					const ends = chalk.yellow(l.timeSlot.End);
					const subj = chalk.yellow(l.subject.Name);
					const teach = chalk.yellow(l.teacher.DisplayName);
					table.addRow(starts, ends, pos, subj, teach);
				} else {
					table.addRow(l.timeSlot.Start, l.timeSlot.End ,l.timeSlot.Position, l.subject.Name, l.teacher.DisplayName);
				}
				

			});
			console.log(table.toString());
		}
		await getLessons();
		async function lessonMenu() {
			console.log(`${chalk.bold("d:YYYY-MM-DD")} - Change date | ${chalk.bold("ENTER")} - next day | ${chalk.bold("q")} - exit`);
			const inp = input('> ');
			if (inp.startsWith('d:')) {
				// check
				const reg = /^d:\d{4}-\d{2}-\d{2}$/;
				if (!reg.test(inp)) {
					console.log(chalk.red('Invalid date format. Please use d:YYYY-MM-DD'));
					setTimeout(async () => {
						console.clear();
						await getLessons();
						lessonMenu();
					}, 2500);
					return;
				}
				date = new Date(inp.substring(2));
				lessonArray = [];
				console.clear();
				await getLessons();
				lessonMenu();
			} else if (inp === '') {
					// enternextday
					date = new Date(date.setDate(date.getDate() + 1));
					lessonArray = [];
					console.clear();
					await getLessons();
					lessonMenu();
			} else if (inp === 'q') {
				console.clear();
				mainMenu();
			} else {
				await getLessons();
				lessonMenu();
			}
		}
		lessonMenu();
	}
};