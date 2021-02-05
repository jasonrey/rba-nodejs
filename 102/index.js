const fs = require('fs');
const chalk = require('chalk');

fs.readFile('./content.txt', (err, data) => {
  const newData = data.toString().replace(/a/g, chalk.red('a'));

  console.log(newData);
});
