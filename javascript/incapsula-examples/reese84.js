import { Salamoonder } from 'salamoonder-js';

const URL = 'https://example.com/';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
const API_KEY = 'sr-YOUR-KEY';

const HEADERS = {
    'User-Agent': USER_AGENT,
    'sec-ch-ua': '"Google Chrome";v="142", "Not-A.Brand";v="8", "Chromium";v="142"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'accept-language': 'en-US,en;q=0.9',
};

async function main() {
    const client = new Salamoonder(API_KEY);

    const response = await client.get(URL, { headers: HEADERS });

    if (!response.text.includes('Pardon Our Interruption') && !response.text.includes('Incapsula incident ID')) {
        console.log('No challenge detected');
        process.exit(0);
    }

    console.log('Incapsula challenge detected');

    const taskId = await client.task.createTask('IncapsulaReese84Solver', {
        website: URL,
        submit_payload: true,
        // reese_url: '...',
        // user_agent: USER_AGENT,
    });

    const result = await client.task.getTaskResult(taskId);

    if (!result.token) {
        console.error('Failed to solve challenge:', result);
        process.exit(1);
    }

    client.session.cookies.set('reese84', result.token, '.example.com', '/');

    const verify = await client.get(URL, { headers: HEADERS });

    if (!verify.text.includes('Pardon Our Interruption') && !verify.text.includes('Incapsula incident ID')) {
        console.log('Successfully bypassed Incapsula!');
    } else {
        console.error('Bypass failed');
    }
}

main();
