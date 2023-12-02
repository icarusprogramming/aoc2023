import * as fs from "node:fs/promises";

const part1 = async () => {
  const file = await fs.open("./input.txt");

  let acc = 0;
  for await (const line of file.readLines()) {
    acc += Number(line.match(/\d/)[0] + line.match(/\d(?!.*\d)/)[0]);
  }
  console.log(acc);
};

const part2 = async () => {
  const file = await fs.open("./input.txt");

  const regex1 = /\d|one|two|three|four|five|six|seven|eight|nine/;
  const regex2 =
    /(\d|one|two|three|four|five|six|seven|eight|nine)(?!.*(\d|one|two|three|four|five|six|seven|eight|nine))/;

  const numbers = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  const getDigit = (myString) => {
    return myString.length > 1
      ? String(numbers.findIndex((number) => number === myString) + 1)
      : myString;
  };

  let acc = 0;
  for await (const line of file.readLines()) {
    const firstNumber = getDigit(line.match(regex1)[0]);

    const secondSearch = line.match(regex2);
    const overlapMatch =
      line.substring(secondSearch.index + 1).match(regex2) ?? secondSearch;

    const secondNumber = getDigit(overlapMatch[0]);

    acc += Number(firstNumber + secondNumber);
  }
  console.log(acc);
};

await part1();
await part2();
