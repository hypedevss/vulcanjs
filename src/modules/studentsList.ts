import * as fs from 'fs';
import { Keystore, AccountTools, VulcanHebe, Pupil } from 'vulcan-api-js';

export default {
    id: "studentslist",
    help: "list all students",
    async run(args: any): Promise<void> {
        if (!fs.existsSync('./auth/keystore.json') || !fs.existsSync('./auth/account.json')) {
            console.log('No account or keystore found, please register first');
            return;
        }
        
        const keystore = new Keystore();
        keystore.loadFromJsonString(fs.readFileSync('./auth/keystore.json', { encoding: 'utf-8' }));
        
        const client = new VulcanHebe(keystore, AccountTools.loadFromJsonString(fs.readFileSync('./auth/account.json', { encoding: 'utf-8' })));
        
        const students = await client.getStudents();
        
        const studentsMap: string[] = students.map(
            x => `${x.pupil.firstName} ${x.pupil.surname} | ID: ${x.pupil.id}`
        );
        
        console.log(studentsMap.join('\n'));
    },
};