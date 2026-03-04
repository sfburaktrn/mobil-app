const https = require('https');
const fs = require('fs');

const agent = new https.Agent({ rejectUnauthorized: false });

https.get('https://www.guresim.com/pehlivan/80/yusuf-can-zeybek', { agent }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        fs.writeFileSync('page.txt', data);
        console.log('DONE');
    });
}).on('error', err => {
    console.error(err);
});
