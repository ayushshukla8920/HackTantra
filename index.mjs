import { GlobalKeyboardListener } from 'node-global-key-listener';
import robot from 'robotjs';
import clipboardy from 'clipboardy';
import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';
const user = JSON.parse(fs.readFileSync('./node_modules/user.json', 'utf-8'));
let isAltPressed = false;
let isKeyPressed = false;
const language = process.env.lang;
const keyboardListener = new GlobalKeyboardListener();
const api_key = process.env.api_key;
const genAI = new GoogleGenerativeAI(api_key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
let isActivated = false;
if(user){
    const date = new Date();
    const validTillDate = new Date(user.valid_till); 
    if(validTillDate>date){
        isActivated = true;
    }
    else{
        fs.writeFileSync('./node_modules/user.json', JSON.stringify({}));
    }
}
if(isActivated){
    keyboardListener.addListener(async function (key) {
        if (key.name === 'LEFT ALT' || key.name === 'RIGHT ALT') {
            isAltPressed = key.state === 'DOWN';
        }
        if (key.name === 'Y' && isAltPressed && !isKeyPressed) {
            console.log("Alt Y pressed");
            isKeyPressed = true;
            const clipboardContent = clipboardy.readSync();
            const query = clipboardContent + "\n Give the answer of this question in simple language in "+language+" without any explanation or comments."
            const result = await model.generateContent(query);
            const answer = result.response.text();
            const lines = answer.split(/\r?\n/);
            for(let line of lines){
                robot.typeString(line);
                robot.keyTap('enter');
            }
            setTimeout(() => {
                isKeyPressed = false;
            }, 200);
        }
        if (key.state === 'UP' && (key.name === 'left alt' || key.name === 'right alt')) {
            isAltPressed = false;
        }
    });
    console.log('Listening for Alt + Y...');
}
else{
    console.log("\n\nProduct is Not Activated Kindly Activate it using RegNo and Password !!\n\n");
}
