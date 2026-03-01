import { Salamoonder } from './src/index.js';

const URL = 'https://example.com/';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36';
const API_KEY = 'sr-YOUR-KEY';

async function main() {
    const client = new Salamoonder(API_KEY);

    const taskId = await client.task.createTask('IncapsulaUTMVCSolver', {
        website: URL,
        user_agent: USER_AGENT,
    });

    const result = await client.task.getTaskResult(taskId);

    if (!result.utmvc) {
        console.error('Failed to solve challenge:', result);
        process.exit(1);
    }

    client.session.cookies.set('___utmvc', result.utmvc, '.example.com', '/');

    console.log('Successfully solved UTMVC challenge:', result.utmvc.substring(0, 150));
    console.log('User-Agent:', result['user-agent']);
}

main();