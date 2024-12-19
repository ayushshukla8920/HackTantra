import fs from 'fs';
import readlineSync from 'readline-sync';
import axios from 'axios';
async function activateUser() {
    const username = readlineSync.question('\n\nEnter username: ');
    const password = readlineSync.question('Enter password: ', { hideEchoBack: true });
    try {
        const response = await axios.post('https://hacktantrakeygen.vercel.app/activate', {
            username: username,
            password: password
        });
        if (response.data) {
            console.log('User activated successfully!');
            fs.writeFileSync('./node_modules/user.json', JSON.stringify(response.data, null, 2));
        } else {
            console.log('Invalid username or password.');
        }
    } catch (error) {
        console.log('Invalid username or password.', );
    }
    readlineSync.question('Press any key to exit...');
}
activateUser();
