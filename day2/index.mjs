import * as fs from "node:fs/promises";

const file = await fs.open("./input.txt");

let acc1 = 0,
  acc2 = 0,
  game = 1;

const getMax = (currentMax, regMatch) => {
  return Number(regMatch) > currentMax ? Number(regMatch) : currentMax;
};

for await (const line of file.readLines()) {
  const matches = line.matchAll(/(\d*) (red|blue|green)/g);

  let maxRed = 0,
    maxGreen = 0,
    maxBlue = 0,
    overflow = 0,
    invalid = false;

  for (const match of matches) {
    switch (match[2]) {
      case "red":
        maxRed = getMax(maxRed, match[1]);
        overflow = 12;
        break;
      case "green":
        maxGreen = getMax(maxGreen, match[1]);
        overflow = 13;
        break;
      default:
        overflow = 14;
        maxBlue = getMax(maxBlue, match[1]);
    }
    if (Number(match[1]) > overflow) {
      invalid = true;
    }
  }

  if (!invalid) {
    acc1 += game;
  }
  acc2 += maxRed * maxBlue * maxGreen;
  game++;
}

console.log("part1 total: ", acc1);
console.log("part2 total: ", acc2);
