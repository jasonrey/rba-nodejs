const fs = require('fs');
const chalk = require('chalk');

let file = '';
let character = '';

for (let i = 2; i < process.argv.length; i++) {
  const [key, value] = process.argv[i].split('=');

  switch (key) {
    case '--file':
      file = value;
      break;
    case '--character':
      character = value;
      break;
  }
}

if (!file || !character) {
  throw new Error('Missing --file or --character');
}

fs.readFile(file, (err, data) => {
  if (err) {
    return console.error(err.message);
  }

  console.log(
    data.toString().replace(new RegExp(character, 'g'), chalk.red(character))
  );
});
