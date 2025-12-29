const os = require('os');
const nets = os.networkInterfaces();
const results = [];
for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
        console.log(`Found: ${net.family} - ${net.address} (Internal: ${net.internal})`);
        if (net.family === 'IPv4' && !net.internal) {
            results.push(`${net.address}:3000`);
        }
    }
}
console.log("Allowed Origins List:", results);
