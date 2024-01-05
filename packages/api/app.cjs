// Node.js CLI Application

const http = require('http');
const readline = require('readline');

const apiUrl = 'http://localhost:8000/api/v0';
const userId = 'me';
let conversationId;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      res.setEncoding('utf8');
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(responseBody));
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function main() {
  const conversation = await makeRequest('PUT', `/api/v0/conversation?userId=${userId}`);
  conversationId = conversation.data.conversationId;

  console.log('Conversation:', conversation);

  rl.setPrompt('\nEnter a message: ');
  rl.prompt();

  rl.on('line', async (line) => {
    const data = { message: line.trim() };
    const response = await makeRequest('PATCH', `/api/v0/chat?userId=${userId}&conversationId=${conversationId}`, data);
    console.log('\x1b[36m%s\x1b[0m', 'AI response:', response.data[0].message.content); // Cyan color
    rl.prompt();
  }).on('close', () => {
    process.exit(0);
  });
}

main();
