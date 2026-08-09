const fs = require('fs');
try {
  const content = fs.readFileSync('tsc-app-errors.txt', 'utf16le');
  fs.writeFileSync('tsc-app-errors-utf8.txt', content, 'utf8');
  console.log('Success');
} catch (e) {
  console.error(e);
}
