import { Salamoonder } from 'salamoonder-js';

const URL = 'https://example.com/login/';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36';
const PROXY = 'http://username:password@gw.exampleproxy.com:823';
const API_KEY = 'sr-YOUR-API-KEY-HERE';

async function main() {
    const client = new Salamoonder(API_KEY);

    const akamaiData = await client.akamai.fetchAndExtract(URL, USER_AGENT, PROXY);
    if (!akamaiData) throw new Error('Failed to retrieve Akamai data');

    let data = '';
    let cookie;

    for (let i = 0; i < 3; i++) {
        const taskId = await client.task.createTask('AkamaiWebSensorSolver', {
            url: akamaiData.base_url,
            abck: akamaiData.abck,
            bmsz: akamaiData.bm_sz,
            script: akamaiData.script_data,
            sensor_url: akamaiData.akamai_url,
            user_agent: USER_AGENT,
            count: i,
            data,
        });

        const result = await client.task.getTaskResult(taskId);
        data = result.data;

        cookie = await client.akamai.postSensor(
            akamaiData.akamai_url,
            result.payload,
            USER_AGENT,
            URL,
            PROXY
        );
    }

    console.log('Successfully solved Akamai on', URL);
    console.log(cookie)
    for (const [k, v] of Object.entries(cookie)) {
        client.session.cookies.set(k, String(v), '.example.com');
    }
}

main();