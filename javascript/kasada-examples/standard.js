import { Salamoonder } from 'salamoonder';

// Configuration
const URL = "https://example.com/auth/v2/customer/login";
const API_KEY = "sr-YOUR-KEY";
let headers = {};

const USERNAME = "USERNAME";
const PASSWORD = "PASSWORD";

const client = new Salamoonder(API_KEY);

try {
    const task_id = await client.task.createTask({
        task_type: "KasadaCaptchaSolver",
        pjs_url: "https://example.com/149e9513-01fa-4fb0-aad4-566afd725d1b/2d206a39-8ed7-437e-a3be-862e0f06eea3/p.js",
        cd_only: "false"
    });

    const result = await client.task.getTaskResult(task_id);

    if (!result["x-kpsdk-ct"]) {
        console.error(`Failed to solve challenge: ${JSON.stringify(result)}`);
        process.exit(1);
    }

    headers = {
        ...headers,
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "ocp-apim-subscription-key": "b4d9f36380184a3788857063bce25d6a",
        "x-kpsdk-cd": result["x-kpsdk-cd"],
        "x-kpsdk-ct": result["x-kpsdk-ct"],
        "user-agent": result["user-agent"],
        "Referer": "https://www.example.com/"
    };

    const payload = {
        ShouldTimeout: false,
        UserName: USERNAME,
        Password: PASSWORD,
        OriginRoute: 'home'
    };

    // Verify bypass
    const response = await fetch(URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });

    const data = await response.text();

    if (response.status !== 429) {
        console.log(`✓ Successfully solved Kasada. ${data}`);
    } else {
        console.error(`✗ Failed to solve Kasada. ${data}`);
    }
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
}
