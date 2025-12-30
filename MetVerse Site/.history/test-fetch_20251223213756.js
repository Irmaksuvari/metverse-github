const fs = require('fs');
const path = require('path');

const headerPath = path.join(__dirname, 'includes', 'header.html');

console.log('Header dosyası path:', headerPath);
console.log('Dosya var mı?', fs.existsSync(headerPath));

if (fs.existsSync(headerPath)) {
    const content = fs.readFileSync(headerPath, 'utf-8');
    console.log('Dosya boyutu:', content.length, 'bytes');
    console.log('İlk 100 karakter:', content.substring(0, 100));
}
