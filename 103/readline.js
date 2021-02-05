const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let name,
  gender,
  age = '';

rl.question('What is your name? ', (answer) => {
  name = answer;

  rl.question('What is your gender? ', (answer) => {
    gender = answer;

    rl.question('What is your age? ', (answer) => {
      age = answer;

      rl.close();

      fs.writeFile(
        './user.json',
        JSON.stringify({
          name,
          gender,
          age,
        }),
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
    });
  });
});
