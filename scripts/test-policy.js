const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const policiesDir = path.join(__dirname, '../src/public/politicas');
const files = fs.readdirSync(policiesDir).filter(f => f.endsWith('.md'));

let allValid = true;

for (const file of files) {
    try {
        console.log(`\nProbando ${file}`);
        execSync(`node scripts/verify-policy.js --file src/public/politicas/${file}`, { stdio: 'inherit' });
    } catch (error) {
        allValid = false;
    }
}

if (!allValid) {
    process.exit(1);
}