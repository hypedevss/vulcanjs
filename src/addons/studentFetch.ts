import * as fs from 'fs';

const getStudentData = () => {
    const studentData: string = fs.readFileSync('./auth/student', { encoding: 'utf-8' });
    if (studentData === "first") {
        return "";
    } else {
        return JSON.parse(studentData);
    }
};

export default getStudentData;