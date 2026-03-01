import { Salamoonder } from 'salamoonder-js';

const URL = 'https://example.com/';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const PROXY = 'http://user:pass@ip:port';
const API_KEY = 'sr-YOUR-KEY';

async function main() {
    const client = new Salamoonder(API_KEY);

    const akamaiData = await client.akamai_sbsd.fetchAndExtract(URL, USER_AGENT, PROXY);
    if (!akamaiData) throw new Error('Failed to retrieve Akamai SBSD data');

    const taskId = await client.task.createTask('AkamaiSBSDSolver', {
        url: akamaiData.base_url,
        cookie: akamaiData.cookie_value,
        sbsd_url: akamaiData.sbsd_url,
        script: akamaiData.script_data,
    });

    const result = await client.task.getTaskResult(taskId);

    const cookie = await client.akamai_sbsd.postSbsd(
        result.payload,
        akamaiData.sbsd_url,
        result['user-agent'],
        URL,
        PROXY
    );

    if (cookie) {
        console.log('Successfully solved Akamai SBSD on', URL);
        console.log('Cookie Dict:', cookie);
    } else {
        console.error('Failed to solve Akamai SBSD');
    }
}

main();