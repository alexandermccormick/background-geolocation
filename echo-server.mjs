import { createServer } from "http";
const port = 8083;
const server = createServer();
server.on("request", (request, response) => {
    const date = new Date();
    let data = [];
    request.on("data", (chunk) => {
        data.push(chunk);
    }).on("end", () => {
        const body = Buffer.concat(data).toString();
        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        }
        catch {
            parsedBody = body;
        }
        notice("\n====================== New Request ======================");
        notice(`${date}`);
        notice(`==== ${request.method} ${request.url}`);
        console.log("\n> Headers:", request.headers);
        if (request.url) {
            const params = new URL(`localhost:8083${request.url}`);
            console.log("\n> Params:");
            for (const param of params.searchParams) {
                const [key, rawValue] = param;
                let value;
                try {
                    value = JSON.parse(rawValue);
                }
                catch {
                    value = rawValue;
                }
                console.log(` ${key}:`, value);
            }
        }
        console.log("\n> Body:\n", parsedBody);
        response.end();
    });
}).listen(port);
console.log(`Echo server running on port ${port}`);
function notice(msg) {
    console.log(`\x1b[33m${msg}\x1b[0m`);
}
