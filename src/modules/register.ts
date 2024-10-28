import chalk = require('chalk');
import * as fs from 'fs';
import { input, mainMenu } from '..';
import * as cheerio from 'cheerio';
import { Keystore } from 'hebece';
import * as jwt from 'jose';
import { AlignmentEnum, AsciiTable3 } from 'ascii-table3';
export default {
	id: "register",
	help: "register a new session",
	async run(): Promise<void> {
		const keystore = new Keystore('./auth/keystore.json', true);
		console.clear();
		if (keystore.has('apRaw') || keystore.has('student')) return function() {
			console.log(`${chalk.red('Session already exists.')}`);
			setTimeout(() => {
				console.clear();
				mainMenu();
			}, 2500);
		}();
		console.log(`Enter your eduvulcan.pl ${chalk.bold(`login`)}:`);
		const login = input('> ');
		const captchaCheck = await fetch(`https://eduvulcan.pl/Account/QueryUserInfo`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				'alias': login
			})
		});
		// @ts-expect-error
		const captchaOut:CaptchaCheckOut = await captchaCheck.json();
		const preSession = await fetch(`https://eduvulcan.pl/logowanie`, {
			method: "GET"
		});
		const $ = cheerio.load(await preSession.text());
		let captchaUser = "";
		function displayCaptcha() {
			console.log(`${chalk.yellow(`Captcha is required.`)}`);
			const captchaQuestion = $('label[for=captchaUser]').text();
			console.log(chalk.bold(captchaQuestion));
			const captchaImage1 = $('img[class="v-captcha-image"]')[0].attribs.src;
			const captchaImage2 = $('img[class="v-captcha-image"]')[1].attribs.src;
			console.log(`How do you want to ${chalk.bold("display")} the captcha images?`);
			console.log(`1. ${chalk.bold("Save to a file")}`);
			console.log(`q. ${chalk.bold("Cancel")}`);
			const captchaInput = input(`> `);
			if (captchaInput == '1') {
				const img1B64 = captchaImage1.split('data:image/png;base64,')[1];
				const img2B64 = captchaImage2.split('data:image/png;base64,')[1];
				if (!fs.existsSync('./captchas')) fs.mkdirSync('./captchas');
				fs.writeFileSync(`./captchas/captcha1.png`, Buffer.from(img1B64, 'base64'));
				fs.writeFileSync(`./captchas/captcha2.png`, Buffer.from(img2B64, 'base64'));
				console.log(`Captcha images saved to ${chalk.bold('./captchas')} folder`);
				console.log(`Please view the captcha images and enter the code:`);
				const captchaCode = input(`> `);
				captchaUser = captchaCode;
				fs.unlinkSync(`./captchas/captcha1.png`);
				fs.unlinkSync(`./captchas/captcha2.png`);
				console.clear();
			} else if (captchaInput == 'q') {
				console.clear();
				mainMenu();
			} else {
				console.log(`${chalk.red(`Invalid input.`)} Please select 1 or q`);
				setTimeout(() => {
					console.clear();
					displayCaptcha();
				}, 2500);
			}
		};
		if (captchaOut.data.ShowCaptcha) {
			displayCaptcha();
		}
		console.log(`Enter your eduvulcan.pl ${chalk.bold(`password`)}:`);
		const password = input.hide('> ');
		const cookieVerification = Array.from(preSession.headers).find(x => x[1].startsWith('__RequestVerificationToken'))[1].split(';')[0].split('=')[1];
		const sessionId = Array.from(preSession.headers).find(x => x[1].startsWith('ASP.NET_SessionId'))[1].split(';')[0].split('=')[1];
		const arrafinity = Array.from(preSession.headers).find(x => x[1].startsWith('ARRAffinity'))[1].split(';')[0].split('=')[1];
		const arredu = Array.from(preSession.headers).find(x => x[1].startsWith('ARR_eduvulcan.pl'))[1].split(';')[0].split('=')[1];
		const verificationToken = $('input[name="__RequestVerificationToken"]').attr('value');
		const session = await fetch(`https://eduvulcan.pl/logowanie`, {
			method: 'POST',
			redirect: 'manual',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/70.0.3538.77 Chrome/70.0.3538.77 Safari/537.36',
				'Cookie': `ASP.NET_SessionId=${sessionId}; __RequestVerificationToken=${cookieVerification}; ARRAffinity=${arrafinity}; ARR_eduvulcan.pl=${arredu};`
			},
			body: new URLSearchParams({
				'Alias': login,
				'Password': password,
				'captchaUser': captchaUser,
				'__RequestVerificationToken': verificationToken
			}),
		});
		if (!session.headers.get('set-cookie')) return function () {
			console.log(`${chalk.red('Failed to log in.')} Is the password or captcha correct?`);
			setTimeout(() => {
				console.clear();
				mainMenu();
			}, 2000);
		}();
		const prometheusWeb = session.headers.get(`set-cookie`).split(';')[0];
		const prometheusAp = await fetch(`https://eduvulcan.pl/api/ap`, {
			method: 'GET',
			headers: {
				Cookie: prometheusWeb,
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/70.0.3538.77 Chrome/70.0.3538.77 Safari/537.36'
			},
		});
		const aptext = await prometheusAp.text();
		const $$ = cheerio.load(aptext);
		const apdata = $$('input[id="ap"]').attr('value');
		const apJson = JSON.parse(apdata);
		keystore.set(`apRaw`, aptext);
		keystore.set(`ap`, apJson);

		const apTokens = apJson.Tokens;
		const students = [];
		// generate student list
		for (let i = 0; i < apTokens.length; i++) {
			const token = apTokens[i];
			const decodedToken = jwt.decodeJwt(token);
			const studentData = {
				tokenIndex: i,
				name: decodedToken.name,
				symbol: decodedToken.tenant
			};
			students.push(studentData);
		}
		console.clear();
		console.log(`${chalk.green('Logged in.')} Please select a student.`);
		function studentMenu() {
			if (students.length === 0) {
				console.log(`${chalk.red('No students found.')} This account cannot be used.`);
				return setTimeout(() => {
					fs.unlinkSync(keystore.path);
					console.clear();
					mainMenu();
				}, 2500);
			}
			const studentsAscii = new AsciiTable3(chalk.bold('Students'))
			.setHeading('num', 'name', 'symbol')
			.setAlign(3, AlignmentEnum.CENTER)
			.setStyle('unicode-single');
		students.forEach((student) => {
			studentsAscii.addRow(chalk.bold(student.tokenIndex + 1), student.name, student.symbol);
		});
		console.log(studentsAscii.toString());
		const studentInput = input(`num: `);
		if (studentInput) {
			if (isNaN(parseInt(studentInput))) return function() {
				console.clear();
				console.log(`${chalk.red('Invalid input.')} Please enter a number.`);
				setTimeout(() => {
					console.clear();
					studentMenu();
				}, 1000);
			}();
			const inp = parseInt(studentInput) - 1;
			const student = students[inp];
			if (!student) return function() {
				console.clear();
				console.log(`${chalk.red('Unknown student.')}`);
				setTimeout(() => {
					console.clear();
					studentMenu();
				}, 1000);
			}();
			keystore.set('student', {index: inp, data: student});
			console.clear();
			console.log(`${chalk.green('Selected student.')} Please wait...`);
			setTimeout(() => {
				console.clear();
				mainMenu();
			}, 1000);
		} else {
			console.clear();
			studentMenu();
		}
		}
		studentMenu();
		
			
	},
};

interface CaptchaCheckOut {
	success: boolean
	data: {
		ShowCaptcha: boolean
		ExtraMessage: string
	}
}