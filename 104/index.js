const fs = require('fs').promises;

async function main() {
  const dataA = await fs.readFile('a.txt', 'utf8');
  const dataB = await fs.readFile('b.txt', 'utf8');
  const dataC = await fs.readFile('c.txt', 'utf8');

  await fs.writeFile(
    'd.txt',
    dataA.toUpperCase() +
      dataB.toLowerCase() +
      dataC.split('').reverse().join('')
  );
}

main();
