const https = require('https');

function httpsPromise(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const result = await httpsPromise('https://reqres.in/api/users/1');
  console.log(result);
}

main();
