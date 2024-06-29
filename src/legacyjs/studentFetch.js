module.exports = () => {
	// student fetch from file
	const studentData = fs.readFileSync('./auth/student', { encoding: 'utf-8' });
	if (studentData === "first") {
		return "";
	}
	else {
		return JSON.parse(studentData);
	}
};